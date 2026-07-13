"""Evaluate detector outputs against synthetic anomaly ground truth.

Educational metrics only: planted anomalies are intentional spikes in the
generator, not clinical truth. False positives illustrate statistical noise.
"""

from __future__ import annotations

from typing import Any

import pandas as pd

from backend.config import (
    Z_THRESHOLD_ATENCAO,
    Z_THRESHOLD_OBSERVACAO,
    Z_THRESHOLD_SINAL_FORTE,
)

SIGNAL_LEVELS = frozenset({"observacao", "atencao", "sinal_forte"})


def classify_by_score(score: float, is_sufficient: bool) -> str:
    """Mirror backend detector thresholds using signed score (not abs)."""
    if not is_sufficient:
        return "nao_interpretavel"
    if score < Z_THRESHOLD_OBSERVACAO:
        return "normal"
    if score < Z_THRESHOLD_ATENCAO:
        return "observacao"
    if score < Z_THRESHOLD_SINAL_FORTE:
        return "atencao"
    return "sinal_forte"


def is_signal_level(level: str) -> bool:
    return level in SIGNAL_LEVELS


def _confusion(y_true: pd.Series, y_pred: pd.Series) -> dict[str, int | float]:
    tp = int(((y_true) & (y_pred)).sum())
    fp = int(((~y_true) & (y_pred)).sum())
    fn = int(((y_true) & (~y_pred)).sum())
    tn = int(((~y_true) & (~y_pred)).sum())
    precision = tp / (tp + fp) if (tp + fp) else 0.0
    recall = tp / (tp + fn) if (tp + fn) else 0.0
    fpr = fp / (fp + tn) if (fp + tn) else 0.0
    return {
        "tp": tp,
        "fp": fp,
        "fn": fn,
        "tn": tn,
        "precision": round(precision, 4),
        "recall": round(recall, 4),
        "false_positive_rate": round(fpr, 4),
        "n": int(len(y_true)),
    }


def evaluate_against_ground_truth(
    analytics: pd.DataFrame,
    ground_truth: pd.DataFrame,
    *,
    sample_false_positives: int = 15,
) -> dict[str, Any]:
    """Compare z-based and MAD-based signals to planted anomalies."""
    if analytics.empty:
        raise ValueError("analytics dataframe is empty")

    keys = ["municipality_id", "condition_id", "year", "epidemiological_week"]
    gt = ground_truth.copy()
    if gt.empty:
        gt_keys = pd.DataFrame(columns=keys)
    else:
        gt_keys = gt[keys].drop_duplicates()
        gt_keys["_is_planted"] = True

    df = analytics.copy()
    for col in ("year", "epidemiological_week"):
        df[col] = df[col].astype(int)
        if not gt_keys.empty:
            gt_keys[col] = gt_keys[col].astype(int)

    if "_is_planted" in gt_keys.columns:
        merged = df.merge(gt_keys, on=keys, how="left")
        merged["is_planted_anomaly"] = merged["_is_planted"].fillna(False).astype(bool)
        merged = merged.drop(columns=["_is_planted"])
    else:
        merged = df
        merged["is_planted_anomaly"] = False

    if "is_sufficient" not in merged.columns:
        merged["is_sufficient"] = True
    else:
        merged["is_sufficient"] = merged["is_sufficient"].fillna(False).astype(bool)

    # Official product classification uses signed z only.
    merged["z_level"] = [
        classify_by_score(float(z), bool(ok))
        for z, ok in zip(merged["z_score"], merged["is_sufficient"], strict=True)
    ]
    merged["mad_level"] = [
        classify_by_score(float(r), bool(ok))
        for r, ok in zip(merged["robust_score"], merged["is_sufficient"], strict=True)
    ]

    y_true = merged["is_planted_anomaly"]
    z_pred = merged["z_level"].map(is_signal_level)
    mad_pred = merged["mad_level"].map(is_signal_level)

    z_metrics = _confusion(y_true, z_pred)
    mad_metrics = _confusion(y_true, mad_pred)

    # False alerts for pedagogy: z-signal without planted anomaly.
    fp_mask = (~y_true) & z_pred
    fp_sample = merged.loc[fp_mask].copy()
    if not fp_sample.empty:
        fp_sample = fp_sample.sort_values("z_score", ascending=False).head(sample_false_positives)
        false_positive_examples = [
            {
                "municipality_id": str(r["municipality_id"]),
                "condition_id": str(r["condition_id"]),
                "year": int(r["year"]),
                "epidemiological_week": int(r["epidemiological_week"]),
                "reported_cases": int(r.get("reported_cases", r.get("observed_cases", 0))),
                "z_score": round(float(r["z_score"]), 3),
                "robust_score": round(float(r["robust_score"]), 3),
                "z_level": str(r["z_level"]),
                "mad_level": str(r["mad_level"]),
                "interpretation": (
                    "Sinal estatístico sem anomalia plantada no gerador — "
                    "candidato a falso alerta pedagógico."
                ),
            }
            for _, r in fp_sample.iterrows()
        ]
    else:
        false_positive_examples = []

    planted = int(y_true.sum())
    return {
        "definition": {
            "positive_label": (
                "Semana com anomalia plantada em anomaly_ground_truth "
                "(spike sintético intencional)."
            ),
            "z_positive": (
                "Nível observacao/atencao/sinal_forte pelo z-score assinado "
                "(regra oficial do produto)."
            ),
            "mad_positive": (
                "Mesmos limiares aplicados ao robust_score (MAD), apenas para comparação."
            ),
            "caveat": (
                "Métricas são educativas. Anomalias plantadas ≠ eventos clínicos. "
                "Falsos positivos mostram ruído estatístico esperado."
            ),
        },
        "summary": {
            "total_observations": int(len(merged)),
            "planted_anomalies": planted,
            "z_signals": int(z_pred.sum()),
            "mad_signals": int(mad_pred.sum()),
        },
        "z_score_method": z_metrics,
        "mad_method": mad_metrics,
        "false_positive_examples": false_positive_examples,
    }
