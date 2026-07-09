from fastapi import APIRouter, Depends, Query

from backend.dependencies import DataStore, get_data_store
from backend.schemas.quality import DataQualityIssue

router = APIRouter()


@router.get("/quality/issues", response_model=list[DataQualityIssue])
def get_quality_issues(
    municipality_id: str | None = Query(None),
    condition_id: str | None = Query(None),
    issue_type: str | None = Query(None),
    severity: str | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=500),
    store: DataStore = Depends(get_data_store),
):
    issues = store.quality_issues
    if municipality_id:
        issues = [i for i in issues if i.get("municipality_id") == municipality_id]
    if condition_id:
        issues = [i for i in issues if i.get("condition_id") == condition_id]
    if issue_type:
        issues = [i for i in issues if i.get("issue_type") == issue_type]
    if severity:
        issues = [i for i in issues if i.get("severity") == severity]
    start = (page - 1) * limit
    return issues[start : start + limit]
