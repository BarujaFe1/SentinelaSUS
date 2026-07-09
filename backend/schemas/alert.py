from pydantic import BaseModel


class AlertSignal(BaseModel):
    signal_id: str
    municipality_id: str
    municipality_name: str
    condition_id: str
    condition_name: str
    epidemiological_week: int
    year: int
    observed_cases: int
    expected_cases: float
    z_score: float
    robust_score: float | None
    alert_level: str
    reliability_score: int
    confidence_notes: str
    data_quality_flags: list[str]
    explanation: str
