"""Generate synthetic epidemiological dataset for SentinelaSUS MVP."""

import argparse
import json
import uuid
from datetime import datetime, timedelta
from pathlib import Path

import numpy as np
import pandas as pd


def _uuid_from_seed(seed: int, prefix: str, index: int) -> str:
    rng = np.random.default_rng(seed + hash(prefix) % (2**31) + index)
    return str(uuid.UUID(bytes=rng.bytes(16)))


def generate(
    seed: int = 42,
    n_municipalities: int = 80,
    n_conditions: int = 3,
    n_weeks: int = 156,
    anomaly_prob: float = 0.03,
    missing_prob: float = 0.02,
    delay_max: int = 3,
) -> dict[str, pd.DataFrame]:
    rng = np.random.default_rng(seed)

    municipalities = []
    bands = ["small", "medium", "large"]
    regions = ["urban", "rural", "mixed"]
    for i in range(n_municipalities):
        mu_id = _uuid_from_seed(seed, "mun", i)
        municipalities.append({
            "municipality_id": mu_id,
            "municipality_name": f"Município {chr(65 + i % 26)}{i}",
            "state": rng.choice(["SF", "SP", "MG", "RJ", "BA", "RS", "PR", "SC"]),
            "population_band": rng.choice(bands, p=[0.4, 0.35, 0.25]),
            "region_type": rng.choice(regions, p=[0.4, 0.3, 0.3]),
            "synthetic_flag": True,
        })
    df_mun = pd.DataFrame(municipalities)

    pop_map = {"small": 10_000, "medium": 50_000, "large": 200_000}
    df_mun["population"] = df_mun["population_band"].map(pop_map)
    df_mun["population"] = (
        df_mun["population"] * rng.uniform(0.7, 1.3, n_municipalities)
    ).astype(int)

    conditions = [
        {
            "condition_id": _uuid_from_seed(seed, "cond", 0),
            "condition_name": "Síndrome Respiratória Aguda Sintética",
            "category": "respiratória",
            "seasonality_profile": "winter_peak",
            "base_rate_per_100k": 150.0,
            "notes": "Dado sintético para demonstração. Pico simulado no inverno.",
        },
        {
            "condition_id": _uuid_from_seed(seed, "cond", 1),
            "condition_name": "Diarréia Aguda Sintética",
            "category": "gastrointestinal",
            "seasonality_profile": "summer_peak",
            "base_rate_per_100k": 80.0,
            "notes": "Dado sintético para demonstração. Pico simulado no verão.",
        },
        {
            "condition_id": _uuid_from_seed(seed, "cond", 2),
            "condition_name": "Evento Sentinela Sintético",
            "category": "sentinela",
            "seasonality_profile": "uniform",
            "base_rate_per_100k": 20.0,
            "notes": "Dado sintético para demonstração. Taxa baixa e sem sazonalidade.",
        },
    ]
    df_cond = pd.DataFrame(conditions)

    seasonality_phase = {
        df_cond.iloc[0]["condition_id"]: 0.0,   # winter peak
        df_cond.iloc[1]["condition_id"]: np.pi,  # summer peak
        df_cond.iloc[2]["condition_id"]: None,   # uniform
    }

    obs_records = []
    anomalies = []
    quality_flags = []

    base_date = datetime(2024, 1, 1)

    for _, mun_row in df_mun.iterrows():
        mu_id = mun_row["municipality_id"]
        pop = mun_row["population"]
        mu_rng = np.random.default_rng(seed + hash(mu_id) % (2**31))

        for _, cond_row in df_cond.iterrows():
            cond_id = cond_row["condition_id"]
            base_rate = cond_row["base_rate_per_100k"]
            phase = seasonality_phase[cond_id]

            sustained_anomaly_start = None
            if mu_rng.random() < 0.15:
                sustained_anomaly_start = mu_rng.integers(10, n_weeks - 10)

            for week in range(1, n_weeks + 1):
                year = 2024 + (week - 1) // 52
                epi_week = ((week - 1) % 52) + 1

                expected_rate = base_rate
                if phase is not None:
                    factor = 1 + 0.5 * np.sin(2 * np.pi * epi_week / 52 - phase)
                    expected_rate *= factor

                expected_cases = expected_rate * pop / 100_000
                expected_cases = max(expected_cases, 0.5)

                noise = mu_rng.poisson(expected_cases)
                cases = max(0, int(round(noise)))

                delayed = mu_rng.poisson(0.5)
                delayed = min(delayed, delay_max)

                completeness = float(np.clip(mu_rng.beta(18, 2), 0.3, 1.0))

                anomaly_mult = 1.0
                if mu_rng.random() < anomaly_prob:
                    anomaly_mult = mu_rng.uniform(5.0, 10.0)
                    anomalies.append({
                        "municipality_id": mu_id,
                        "condition_id": cond_id,
                        "year": year,
                        "epidemiological_week": epi_week,
                        "observed_cases": int(round(cases * anomaly_mult)),
                        "expected_cases": round(expected_cases, 2),
                        "anomaly_type": "pontual",
                        "generation_seed": seed,
                    })

                if (
                    sustained_anomaly_start
                    and sustained_anomaly_start <= week < sustained_anomaly_start + 4
                ):
                    anomaly_mult = mu_rng.uniform(3.0, 5.0)
                    if week == sustained_anomaly_start:
                        anomalies.append({
                            "municipality_id": mu_id,
                            "condition_id": cond_id,
                            "year": year,
                            "epidemiological_week": epi_week,
                            "observed_cases": int(round(cases * anomaly_mult)),
                            "expected_cases": round(expected_cases, 2),
                            "anomaly_type": "sustentada",
                            "generation_seed": seed,
                        })

                pre_anomaly = cases
                cases = int(round(cases * anomaly_mult))

                if mu_rng.random() < missing_prob:
                    completeness = 0.0
                    cases = 0
                    quality_flags.append({
                        "municipality_id": mu_id,
                        "condition_id": cond_id,
                        "week": epi_week,
                        "year": year,
                        "issue_type": "missing_weeks",
                        "severity": "high",
                        "affected_metric": "reported_cases",
                        "explanation": "Semana sem notificação registrada",
                    })

                obs_records.append({
                    "observation_id": _uuid_from_seed(seed + week, "obs", len(obs_records) + 1),
                    "municipality_id": mu_id,
                    "condition_id": cond_id,
                    "epidemiological_week": epi_week,
                    "year": year,
                    "week_start_date": (base_date + timedelta(weeks=week - 1)).strftime("%Y-%m-%d"),
                    "reported_cases": cases,
                    "expected_cases": pre_anomaly,
                    "delayed_reports": delayed,
                    "completeness_score": round(completeness, 4),
                    "source_type": "simulated",
                    "synthetic_generation_seed": seed,
                })

                if completeness < 0.5 and mu_rng.random() < 0.3:
                    quality_flags.append({
                        "municipality_id": mu_id,
                        "condition_id": cond_id,
                        "week": epi_week,
                        "year": year,
                        "issue_type": "low_completeness",
                        "severity": "medium",
                        "affected_metric": "completeness",
                        "explanation": f"Completude abaixo de 50% ({completeness:.2f})",
                    })

    df_obs = pd.DataFrame(obs_records)
    df_anomalies = pd.DataFrame(anomalies)
    df_quality = pd.DataFrame(quality_flags)

    metadata = {
        "project": "SentinelaSUS",
        "description": "Dataset sintético de vigilância epidemiológica para demonstração",
        "generation_seed": seed,
        "n_municipalities": n_municipalities,
        "n_conditions": n_conditions,
        "n_weeks": n_weeks,
        "anomaly_probability": anomaly_prob,
        "missing_probability": missing_prob,
        "delay_max_weeks": delay_max,
        "generated_at": datetime.now().isoformat(),
        "notes": (
            "Dados 100% sintéticos. Não contém dados reais "
            "de pacientes ou notificações oficiais."
        ),
    }

    return {
        "municipalities": df_mun,
        "conditions": df_cond,
        "weekly_observations": df_obs,
        "anomaly_ground_truth": df_anomalies,
        "data_quality_flags": df_quality,
        "metadata": metadata,
    }


def save(dataset: dict, output_dir: Path):
    output_dir.mkdir(parents=True, exist_ok=True)
    for name, data in dataset.items():
        if isinstance(data, pd.DataFrame):
            path = output_dir / f"{name}.csv"
            data.to_csv(path, index=False)
            print(f"  Salvo: {path} ({len(data)} linhas)")
        elif isinstance(data, dict):
            path = output_dir / f"{name}.json"
            with open(path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"  Salvo: {path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Gera dataset sintético SentinelaSUS")
    parser.add_argument("--seed", type=int, default=42, help="Seed de reproducibilidade")
    parser.add_argument("--n-municipalities", type=int, default=80)
    parser.add_argument("--n-conditions", type=int, default=3)
    parser.add_argument("--n-weeks", type=int, default=156)
    parser.add_argument("--anomaly-probability", type=float, default=0.03)
    parser.add_argument("--missing-probability", type=float, default=0.02)
    parser.add_argument("--delay-max-weeks", type=int, default=3)
    parser.add_argument(
        "--output",
        type=str,
        default=None,
        help="Diretório de saída (default: data/synthetic/)",
    )

    args = parser.parse_args()
    output_dir = (
        Path(args.output)
        if args.output
        else Path(__file__).resolve().parent.parent / "data" / "synthetic"
    )

    print(f"Gerando dataset sintético (seed={args.seed})...")
    dataset = generate(
        seed=args.seed,
        n_municipalities=args.n_municipalities,
        n_conditions=args.n_conditions,
        n_weeks=args.n_weeks,
        anomaly_prob=args.anomaly_probability,
        missing_prob=args.missing_probability,
        delay_max=args.delay_max_weeks,
    )
    save(dataset, output_dir)
    print("Geração concluída.")
