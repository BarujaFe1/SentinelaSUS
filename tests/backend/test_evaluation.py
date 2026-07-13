"""Regression tests for educational false-alert evaluation."""

import pandas as pd

from backend.pipeline.evaluation import (
    classify_by_score,
    evaluate_against_ground_truth,
    is_signal_level,
)


def test_classify_uses_signed_score_not_abs():
    assert classify_by_score(-3.0, True) == "normal"
    assert classify_by_score(1.6, True) == "observacao"
    assert classify_by_score(2.1, True) == "atencao"
    assert classify_by_score(2.6, True) == "sinal_forte"
    assert classify_by_score(9.0, False) == "nao_interpretavel"


def test_evaluate_counts_false_positives():
    analytics = pd.DataFrame(
        [
            {
                "municipality_id": "m1",
                "condition_id": "c1",
                "year": 2025,
                "epidemiological_week": 10,
                "reported_cases": 40,
                "z_score": 2.6,
                "robust_score": 2.7,
                "is_sufficient": True,
            },
            {
                "municipality_id": "m1",
                "condition_id": "c1",
                "year": 2025,
                "epidemiological_week": 11,
                "reported_cases": 12,
                "z_score": 0.2,
                "robust_score": 0.1,
                "is_sufficient": True,
            },
            {
                "municipality_id": "m1",
                "condition_id": "c1",
                "year": 2025,
                "epidemiological_week": 12,
                "reported_cases": 50,
                "z_score": 3.0,
                "robust_score": 2.8,
                "is_sufficient": True,
            },
        ]
    )
    ground_truth = pd.DataFrame(
        [
            {
                "municipality_id": "m1",
                "condition_id": "c1",
                "year": 2025,
                "epidemiological_week": 12,
                "anomaly_type": "pontual",
            }
        ]
    )
    result = evaluate_against_ground_truth(analytics, ground_truth)
    assert result["summary"]["planted_anomalies"] == 1
    assert result["z_score_method"]["tp"] == 1
    assert result["z_score_method"]["fp"] == 1
    assert result["z_score_method"]["fn"] == 0
    assert result["z_score_method"]["tn"] == 1
    assert len(result["false_positive_examples"]) == 1
    assert result["false_positive_examples"][0]["epidemiological_week"] == 10
    assert is_signal_level("sinal_forte")
    assert not is_signal_level("normal")
