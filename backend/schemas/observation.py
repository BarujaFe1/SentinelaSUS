from datetime import date

from pydantic import BaseModel


class Observation(BaseModel):
    observation_id: str
    municipality_id: str
    condition_id: str
    epidemiological_week: int
    year: int
    week_start_date: date
    reported_cases: int
    expected_cases: float
    delayed_reports: int
    completeness_score: float
    source_type: str


class ObservationAnalytics(Observation):
    z_score: float
    robust_score: float | None
    alert_level: str
    reliability_score: int
    baseline_mean: float
    baseline_std: float
    baseline_median: float
    baseline_mad: float
