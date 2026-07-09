import numpy as np

from backend.config import RELIABILITY_WEIGHTS


def calculate_reliability(
    sample_size: int,
    completeness: float,
    avg_delay: float,
    values: list[float],
    observed_cases: int,
) -> int:
    baseline_score = 0
    if sample_size >= 5:
        baseline_score = 100
    elif sample_size >= 3:
        baseline_score = 60
    else:
        baseline_score = 0

    completeness_score = completeness * 100

    delay_score = max(0, 100 - (avg_delay * 25))

    arr = np.array(values)
    cv = float(np.std(arr) / np.mean(arr)) if np.mean(arr) > 0 else 1.0
    stability_score = max(0, 100 - min(cv * 100, 100))

    volume_score = min(observed_cases / 10 * 100, 100)

    total = (
        baseline_score * RELIABILITY_WEIGHTS["baseline_sufficient"]
        + completeness_score * RELIABILITY_WEIGHTS["completeness_score"]
        + delay_score * RELIABILITY_WEIGHTS["delay_score"]
        + stability_score * RELIABILITY_WEIGHTS["stability_score"]
        + volume_score * RELIABILITY_WEIGHTS["volume_score"]
    ) / sum(RELIABILITY_WEIGHTS.values())

    return int(round(max(0, min(100, total))))
