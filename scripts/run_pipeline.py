"""Run the full SentinelaSUS pipeline: raw -> bronze -> silver -> gold."""

import json
import uuid

import pandas as pd

from backend.config import BRONZE_DIR, GOLD_DIR, SILVER_DIR, SYNTHETIC_DIR
from backend.pipeline.baselines import build_baselines
from backend.pipeline.detector import detect_alerts
from backend.pipeline.loader import load_csv
from backend.pipeline.normalizer import normalize_observations
from backend.pipeline.reliability import calculate_reliability
from backend.pipeline.validator import calculate_completeness, validate_observations


def ensure_dirs():
    for d in [BRONZE_DIR, SILVER_DIR, GOLD_DIR]:
        d.mkdir(parents=True, exist_ok=True)


def _key(mun_id, cond_id, week, year):
    return (mun_id, cond_id, int(week), int(year))


def run():
    ensure_dirs()

    print("[raw -> bronze] Carregando dados sintéticos...")
    df_obs = load_csv(SYNTHETIC_DIR / "weekly_observations.csv")
    df_mun = load_csv(SYNTHETIC_DIR / "municipalities.csv")
    df_cond = load_csv(SYNTHETIC_DIR / "conditions.csv")

    print(f"  Observações: {len(df_obs)}")
    print(f"  Municípios: {len(df_mun)}")
    print(f"  Condições: {len(df_cond)}")

    df_obs = normalize_observations(df_obs)
    df_obs.to_parquet(BRONZE_DIR / "observations.parquet", index=False)
    print(f"  Salvo: {BRONZE_DIR / 'observations.parquet'}")

    print("[bronze -> silver] Validando dados...")
    df_obs = validate_observations(df_obs)
    calculate_completeness(df_obs, total_expected=52 * 3)
    df_obs.to_parquet(SILVER_DIR / "observations_validated.parquet", index=False)
    print(f"  Salvo: {SILVER_DIR / 'observations_validated.parquet'}")

    print("[silver -> gold] Calculando baselines históricos...")
    # Use reported_cases (not expected) so baselines reflect observed history.
    baselines = build_baselines(df_obs, use_expected=False)
    baselines.to_parquet(GOLD_DIR / "baselines.parquet", index=False)
    print(f"  Baselines calculados: {len(baselines)}")

    print("[silver -> gold] Detectando sinais...")
    alerts_df = detect_alerts(df_obs, baselines)
    print(f"  Observações analíticas: {len(alerts_df)}")

    mun_name = dict(zip(df_mun["municipality_id"], df_mun["municipality_name"]))
    cond_name = dict(zip(df_cond["condition_id"], df_cond["condition_name"]))

    # Aggregate (municipality, condition) stats for reliability scoring.
    agg = (
        df_obs.groupby(["municipality_id", "condition_id"])
        .agg(
            avg_completeness=("completeness_score", "mean"),
            avg_delay=("delayed_reports", "mean"),
            values=("reported_cases", lambda s: s.tolist()),
        )
        .reset_index()
    )
    agg_map = {
        (r["municipality_id"], r["condition_id"]): r for _, r in agg.iterrows()
    }
    sample_size_map = {
        (r["municipality_id"], r["condition_id"]): int(r["sample_size"])
        for _, r in baselines.iterrows()
    }

    def _reliability_for(mun_id, cond_id, observed):
        stat = agg_map.get((mun_id, cond_id))
        completeness = float(stat["avg_completeness"]) if stat is not None else 0.0
        avg_delay = float(stat["avg_delay"]) if stat is not None else 0.0
        values = list(stat["values"]) if stat is not None else [observed]
        sample_size = sample_size_map.get((mun_id, cond_id), 0)
        return calculate_reliability(
            sample_size=sample_size,
            completeness=completeness,
            avg_delay=avg_delay,
            values=values,
            observed_cases=observed,
        )

    alerts_df["reliability_score"] = [
        _reliability_for(r["municipality_id"], r["condition_id"], int(r["reported_cases"]))
        for _, r in alerts_df.iterrows()
    ]
    alerts_df.to_parquet(GOLD_DIR / "observations_analytics.parquet", index=False)
    print(f"  Analytics salvo com reliability_score: {len(alerts_df)}")

    # Quality flags lookup per observation.
    df_quality_raw = load_csv(SYNTHETIC_DIR / "data_quality_flags.csv")
    quality_map: dict[tuple, list[str]] = {}
    for _, qr in df_quality_raw.iterrows():
        quality_map.setdefault(
            _key(qr["municipality_id"], qr["condition_id"], qr["week"], qr["year"]), []
        ).append(str(qr["issue_type"]))

    alert_levels = ("nao_interpretavel", "atencao", "sinal_forte", "observacao")
    alert_records = []
    for _, row in alerts_df.iterrows():
        if row["alert_level"] not in alert_levels:
            continue

        mun_id = row["municipality_id"]
        cond_id = row["condition_id"]
        observed = int(row["reported_cases"])
        z = float(row["z_score"])

        stat = agg_map.get((mun_id, cond_id))
        completeness = float(stat["avg_completeness"]) if stat is not None else 0.0
        avg_delay = float(stat["avg_delay"]) if stat is not None else 0.0
        values = list(stat["values"]) if stat is not None else [observed]
        sample_size = sample_size_map.get((mun_id, cond_id), 0)

        reliability = calculate_reliability(
            sample_size=sample_size,
            completeness=completeness,
            avg_delay=avg_delay,
            values=values,
            observed_cases=observed,
        )

        robust = row["robust_score"]
        robust_str = f"{float(robust):.2f}" if pd.notna(robust) else "n/d"
        explanation = (
            f"Z-score: {z:.2f} (MAD robusto: {robust_str}). "
            f"Nível: {row['alert_level']}. Confiabilidade: {reliability}/100."
        )
        if reliability < 50:
            confidence_notes = (
                "Confiabilidade baixa — interpretar com cautela e revisar qualidade dos dados."
            )
        elif row["alert_level"] == "nao_interpretavel":
            confidence_notes = "Dados históricos insuficientes para classificação confiável."
        else:
            confidence_notes = "Sinal com dados suficientes para interpretação responsável."

        flags = quality_map.get(
            _key(mun_id, cond_id, row["epidemiological_week"], row["year"]), []
        )

        alert_records.append({
            "signal_id": row.get("observation_id", f"sig_{len(alert_records)}"),
            "municipality_id": mun_id,
            "municipality_name": mun_name.get(mun_id, "Desconhecido"),
            "condition_id": cond_id,
            "condition_name": cond_name.get(cond_id, "Desconhecido"),
            "epidemiological_week": int(row["epidemiological_week"]),
            "year": int(row["year"]),
            "observed_cases": observed,
            "expected_cases": float(row["baseline_mean"]),
            "z_score": z,
            "robust_score": None if pd.isna(robust) else float(robust),
            "alert_level": str(row["alert_level"]),
            "reliability_score": reliability,
            "confidence_notes": confidence_notes,
            "data_quality_flags": flags,
            "explanation": explanation,
        })

    df_alerts = pd.DataFrame(alert_records)
    if not df_alerts.empty:
        df_alerts.to_parquet(GOLD_DIR / "alerts.parquet", index=False)
        print(f"  Alertas gerados: {len(df_alerts)}")

    print("[gold] Salvando qualidade com esquema completo...")
    quality_rows = []
    for _, qr in df_quality_raw.iterrows():
        mun = qr["municipality_id"]
        cond = qr["condition_id"]
        quality_rows.append({
            "issue_id": str(
                uuid.uuid5(
                    uuid.NAMESPACE_DNS,
                    f"{mun}|{cond}|{qr['week']}|{qr['year']}|{qr['issue_type']}",
                )
            ),
            "municipality_id": mun,
            "municipality_name": mun_name.get(mun, "Desconhecido"),
            "condition_id": cond,
            "condition_name": cond_name.get(cond, "Desconhecido"),
            "week": int(qr["week"]),
            "year": int(qr["year"]),
            "issue_type": str(qr["issue_type"]),
            "severity": str(qr["severity"]),
            "affected_metric": str(qr["affected_metric"]),
            "explanation": str(qr["explanation"]),
        })
    df_quality_gold = pd.DataFrame(quality_rows)
    df_quality_gold.to_parquet(GOLD_DIR / "quality_issues.parquet", index=False)
    print(f"  Problemas de qualidade: {len(df_quality_gold)}")

    print("[gold] Salvando cópia dos municípios...")
    df_mun.to_parquet(GOLD_DIR / "municipalities.parquet", index=False)

    meta_path = SYNTHETIC_DIR / "metadata.json"
    if meta_path.exists():
        metadata = json.loads(meta_path.read_text())
        metadata["pipeline_run_at"] = pd.Timestamp.now().isoformat()
        with open(GOLD_DIR / "pipeline_metadata.json", "w") as f:
            json.dump(metadata, f, indent=2)

    print("Pipeline concluído.")


if __name__ == "__main__":
    run()
