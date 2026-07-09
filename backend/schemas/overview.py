from pydantic import BaseModel


class OverviewKPIs(BaseModel):
    total_municipalities: int
    total_conditions: int
    total_weeks_analyzed: int
    alert_counts: dict[str, int]
    non_interpretable_count: int
    average_reliability: float
    total_quality_issues: int
