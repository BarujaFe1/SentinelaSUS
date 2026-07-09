import pandas as pd


def normalize_observations(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    if "week_start_date" in df.columns:
        df["week_start_date"] = pd.to_datetime(df["week_start_date"])
    df["epidemiological_week"] = df["epidemiological_week"].astype(int)
    df["year"] = df["year"].astype(int)
    df["reported_cases"] = df["reported_cases"].fillna(0).astype(int)
    df["delayed_reports"] = df["delayed_reports"].fillna(0).astype(int)
    df["completeness_score"] = df["completeness_score"].fillna(0.0).clip(0.0, 1.0)
    return df
