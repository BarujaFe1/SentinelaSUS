import pandas as pd


def validate_observations(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["reported_cases"] = df["reported_cases"].clip(lower=0)
    return df


def detect_missing_weeks(df: pd.DataFrame, all_weeks: list[tuple[int, int]]) -> list[dict]:
    missing = []
    for (mun_id, cond_id), group in df.groupby(["municipality_id", "condition_id"]):
        existing = set(zip(group["year"], group["epidemiological_week"]))
        for year, week in all_weeks:
            if (year, week) not in existing:
                missing.append({
                    "municipality_id": mun_id,
                    "condition_id": cond_id,
                    "year": year,
                    "week": week,
                    "issue_type": "missing_weeks",
                })
    return missing


def calculate_completeness(df: pd.DataFrame, total_expected: int) -> pd.DataFrame:
    complete = (
        df.groupby(["municipality_id", "condition_id"])["completeness_score"]
        .mean()
        .reset_index()
    )
    complete.rename(columns={"completeness_score": "avg_completeness"}, inplace=True)
    return complete
