from datetime import datetime

from pydantic import BaseModel


class ReportBrief(BaseModel):
    report_id: str
    generated_at: datetime
    selected_filters: dict
    main_findings: list[str]
    limitations: list[str]
    recommended_next_checks: list[str]
    disclaimer: str
