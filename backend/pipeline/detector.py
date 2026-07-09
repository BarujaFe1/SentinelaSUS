import numpy as np
import pandas as pd

from backend.config import (
    Z_THRESHOLD_ATENCAO,
    Z_THRESHOLD_OBSERVACAO,
    Z_THRESHOLD_SINAL_FORTE,
)

EPS = 0.1


def detect_alerts(df: pd.DataFrame, baselines: pd.DataFrame) -> pd.DataFrame:
    baselines_renamed = baselines.rename(columns={"target_week": "epidemiological_week"})
    merged = df.merge(
        baselines_renamed,
        on=["municipality_id", "condition_id", "epidemiological_week"],
        how="left",
    )

    merged["baseline_mean"] = merged["baseline_mean"].fillna(0.0)
    merged["baseline_std"] = merged["baseline_std"].fillna(0.0)
    merged["baseline_median"] = merged["baseline_median"].fillna(0.0)
    merged["baseline_mad"] = merged["baseline_mad"].fillna(0.0)
    merged["is_sufficient"] = merged["is_sufficient"].fillna(False)

    merged["z_score"] = (
        (merged["reported_cases"] - merged["baseline_mean"])
        / np.maximum(merged["baseline_std"], EPS)
    )

    merged["robust_score"] = (
        (merged["reported_cases"] - merged["baseline_median"])
        / np.maximum(merged["baseline_mad"] * 1.4826, EPS)
    )

    merged["alert_level"] = merged.apply(_classify_alert, axis=1)

    return merged


def _classify_alert(row):
    if not row["is_sufficient"]:
        return "nao_interpretavel"
    z = row["z_score"]
    if z < Z_THRESHOLD_OBSERVACAO:
        return "normal"
    elif z < Z_THRESHOLD_ATENCAO:
        return "observacao"
    elif z < Z_THRESHOLD_SINAL_FORTE:
        return "atencao"
    else:
        return "sinal_forte"
