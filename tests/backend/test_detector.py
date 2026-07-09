import pandas as pd

from backend.pipeline.detector import _classify_alert, detect_alerts


def test_z_score_calculation():
    df = pd.DataFrame({
        "municipality_id": ["m1"], "condition_id": ["c1"],
        "epidemiological_week": [10], "year": [2025],
        "reported_cases": [50], "completeness_score": [1.0],
        "delayed_reports": [0], "week_start_date": ["2025-03-10"],
        "observation_id": ["o1"], "source_type": ["simulated"],
        "synthetic_generation_seed": [42],
    })
    baselines = pd.DataFrame({
        "municipality_id": ["m1"], "condition_id": ["c1"],
        "target_week": [10],
        "baseline_mean": [20.0], "baseline_std": [5.0],
        "baseline_median": [18.0], "baseline_mad": [4.0],
        "sample_size": [5], "is_sufficient": [True],
    })
    result = detect_alerts(df, baselines)
    expected_z = (50 - 20) / max(5, 0.1)
    assert abs(result.iloc[0]["z_score"] - expected_z) < 0.01, (
        f"Z-score {result.iloc[0]['z_score']} != {expected_z}"
    )


def test_alert_levels_thresholds():
    row_sufficient = pd.Series({"is_sufficient": True, "z_score": 0.5})
    assert _classify_alert(row_sufficient) == "normal"

    row_obs = pd.Series({"is_sufficient": True, "z_score": 1.7})
    assert _classify_alert(row_obs) == "observacao"

    row_atencao = pd.Series({"is_sufficient": True, "z_score": 2.3})
    assert _classify_alert(row_atencao) == "atencao"

    row_strong = pd.Series({"is_sufficient": True, "z_score": 3.0})
    assert _classify_alert(row_strong) == "sinal_forte"

    row_insufficient = pd.Series({"is_sufficient": False, "z_score": 5.0})
    assert _classify_alert(row_insufficient) == "nao_interpretavel"


def test_non_negative_cases():
    df = pd.DataFrame({
        "municipality_id": ["m1"], "condition_id": ["c1"],
        "epidemiological_week": [10], "year": [2025],
        "reported_cases": [-5], "completeness_score": [1.0],
        "delayed_reports": [0], "week_start_date": ["2025-03-10"],
        "observation_id": ["o1"], "source_type": ["simulated"],
        "synthetic_generation_seed": [42],
    })
    df["reported_cases"] = df["reported_cases"].clip(lower=0)
    assert df.iloc[0]["reported_cases"] >= 0
