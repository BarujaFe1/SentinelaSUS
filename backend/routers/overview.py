from fastapi import APIRouter, Depends

from backend.dependencies import DataStore, get_data_store
from backend.schemas.overview import OverviewKPIs

router = APIRouter()


@router.get("/overview", response_model=OverviewKPIs)
def get_overview(store: DataStore = Depends(get_data_store)):
    alerts = store.alerts
    alert_counts = {}
    for a in alerts:
        level = a.get("alert_level", "normal")
        alert_counts[level] = alert_counts.get(level, 0) + 1

    municipalities_names = set(a.get("municipality_id") for a in store.municipalities)
    conditions_names = set(c.get("condition_id") for c in store.conditions)
    years_weeks = set((o.get("year"), o.get("epidemiological_week")) for o in store.observations)

    reliability_scores = [
        a.get("reliability_score", 0)
        for a in alerts
        if a.get("reliability_score") is not None
    ]
    avg_reliability = (
        sum(reliability_scores) / len(reliability_scores) if reliability_scores else 0.0
    )

    return OverviewKPIs(
        total_municipalities=len(municipalities_names),
        total_conditions=len(conditions_names),
        total_weeks_analyzed=len(years_weeks),
        alert_counts=alert_counts,
        non_interpretable_count=alert_counts.get("nao_interpretavel", 0),
        average_reliability=round(avg_reliability, 1),
        total_quality_issues=len(store.quality_issues),
    )
