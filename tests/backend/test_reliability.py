from backend.pipeline.reliability import calculate_reliability


def test_reliability_range():
    score = calculate_reliability(
        sample_size=10,
        completeness=0.9,
        avg_delay=0.5,
        values=[10, 12, 11, 13, 10, 11, 12],
        observed_cases=15,
    )
    assert 0 <= score <= 100, f"Score {score} fora do range [0, 100]"


def test_low_reliability_for_insufficient_baseline():
    score = calculate_reliability(
        sample_size=1,
        completeness=0.3,
        avg_delay=5.0,
        values=[5, 5, 5],
        observed_cases=2,
    )
    assert score < 50, f"Esperava score baixo, got {score}"


def test_high_reliability_for_good_data():
    score = calculate_reliability(
        sample_size=10,
        completeness=1.0,
        avg_delay=0.0,
        values=[10, 11, 10, 12, 10, 11, 10, 12, 10, 11],
        observed_cases=25,
    )
    assert score > 70, f"Esperava score alto, got {score}"
