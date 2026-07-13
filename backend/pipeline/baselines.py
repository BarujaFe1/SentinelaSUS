import numpy as np
import pandas as pd


def build_baselines(df: pd.DataFrame, use_expected: bool = False) -> pd.DataFrame:
    """Baseline por município/condição/semana epidemiológica.

    Agrega ``reported_cases`` (padrão) na mesma semana ao longo dos anos
    disponíveis. Exige >= 3 observações para ``is_sufficient``.

    Limitação do MVP: a agregação inclui todos os anos da semana (incluindo o
    ano avaliado). Isso é documentado em docs/methodology.md.
    """
    value_col = "expected_cases" if use_expected else "reported_cases"
    df = df.copy()

    rows = []
    for (mun_id, cond_id, target_week), group in df.groupby(
        ["municipality_id", "condition_id", "epidemiological_week"]
    ):
        values = group[value_col].astype(float).values
        n = len(values)
        if n < 2:
            rows.append({
                "municipality_id": mun_id,
                "condition_id": cond_id,
                "target_week": int(target_week),
                "baseline_mean": 0.0,
                "baseline_std": 0.0,
                "baseline_median": 0.0,
                "baseline_mad": 0.0,
                "sample_size": n,
                "is_sufficient": False,
            })
            continue

        median = float(np.median(values))
        mad = float(np.median(np.abs(values - median)))
        rows.append({
            "municipality_id": mun_id,
            "condition_id": cond_id,
            "target_week": int(target_week),
            "baseline_mean": float(np.mean(values)),
            "baseline_std": float(np.std(values, ddof=1)) if n > 1 else 0.0,
            "baseline_median": median,
            "baseline_mad": mad,
            "sample_size": n,
            "is_sufficient": n >= 3,
        })

    return pd.DataFrame(rows)
