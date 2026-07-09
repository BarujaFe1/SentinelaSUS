import numpy as np
import pandas as pd


def build_baselines(df: pd.DataFrame, use_expected: bool = False) -> pd.DataFrame:
    """Calculate historical baseline per municipality/condition/week."""
    value_col = "expected_cases" if use_expected else "reported_cases"
    df = df.copy()

    df["_mu_cond_week"] = (
        df["municipality_id"] + "_" + df["condition_id"] + "_"
        + df["epidemiological_week"].astype(str)
    )

    rows = []
    for (mun_id, cond_id, target_week), group in df.groupby(
        ["municipality_id", "condition_id", "epidemiological_week"]
    ):
        if len(group) < 2:
            rows.append({
                "municipality_id": mun_id,
                "condition_id": cond_id,
                "target_week": target_week,
                "baseline_mean": 0.0,
                "baseline_std": 0.0,
                "baseline_median": 0.0,
                "baseline_mad": 0.0,
                "sample_size": len(group),
                "is_sufficient": False,
            })
            continue

        values = group[value_col].values
        median = np.median(values)
        mad = np.median(np.abs(values - median))
        rows.append({
            "municipality_id": mun_id,
            "condition_id": cond_id,
            "target_week": target_week,
            "baseline_mean": float(np.mean(values)),
            "baseline_std": float(np.std(values, ddof=1)),
            "baseline_median": float(median),
            "baseline_mad": float(mad),
            "sample_size": len(values),
            "is_sufficient": len(values) >= 3,
        })

    return pd.DataFrame(rows)
