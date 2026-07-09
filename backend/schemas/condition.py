from pydantic import BaseModel


class Condition(BaseModel):
    condition_id: str
    condition_name: str
    category: str
    seasonality_profile: str
    base_rate_per_100k: float
    notes: str
