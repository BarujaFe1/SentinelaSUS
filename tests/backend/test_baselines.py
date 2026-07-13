import pandas as pd

from backend.pipeline.baselines import build_baselines


def test_baselines_use_reported_cases_by_default():
    df = pd.DataFrame({
        "municipality_id": ["m1", "m1", "m1"],
        "condition_id": ["c1", "c1", "c1"],
        "epidemiological_week": [10, 10, 10],
        "year": [2023, 2024, 2025],
        "reported_cases": [10, 20, 30],
        "expected_cases": [100, 100, 100],
    })
    result = build_baselines(df, use_expected=False)
    assert len(result) == 1
    assert abs(result.iloc[0]["baseline_mean"] - 20.0) < 1e-9
    assert bool(result.iloc[0]["is_sufficient"]) is True


def test_baselines_insufficient_sample():
    df = pd.DataFrame({
        "municipality_id": ["m1"],
        "condition_id": ["c1"],
        "epidemiological_week": [10],
        "year": [2025],
        "reported_cases": [10],
        "expected_cases": [10],
    })
    result = build_baselines(df)
    assert bool(result.iloc[0]["is_sufficient"]) is False
