from pydantic import BaseModel


class Municipality(BaseModel):
    municipality_id: str
    municipality_name: str
    state: str
    population_band: str
    region_type: str
    synthetic_flag: bool


class MunicipalitySummary(BaseModel):
    municipality: Municipality
    total_conditions: int
    total_weeks: int
    active_alerts: int
    average_completeness: float
    average_delay: float
    overall_reliability: float
