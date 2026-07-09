from pydantic import BaseModel


class DataQualityIssue(BaseModel):
    issue_id: str
    municipality_id: str
    municipality_name: str
    condition_id: str
    condition_name: str
    week: int
    year: int
    issue_type: str
    severity: str
    affected_metric: str
    explanation: str
