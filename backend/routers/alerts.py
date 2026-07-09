from fastapi import APIRouter, Depends, HTTPException, Query

from backend.dependencies import DataStore, get_data_store
from backend.schemas.alert import AlertSignal

router = APIRouter()


@router.get("/alerts", response_model=list[AlertSignal])
def get_alerts(
    alert_level: str | None = Query(None),
    municipality_id: str | None = Query(None),
    condition_id: str | None = Query(None),
    min_reliability: int | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=500),
    store: DataStore = Depends(get_data_store),
):
    alerts = store.alerts
    if alert_level:
        alerts = [a for a in alerts if a.get("alert_level") == alert_level]
    if municipality_id:
        alerts = [a for a in alerts if a.get("municipality_id") == municipality_id]
    if condition_id:
        alerts = [a for a in alerts if a.get("condition_id") == condition_id]
    if min_reliability is not None:
        alerts = [a for a in alerts if (a.get("reliability_score") or 0) >= min_reliability]
    start = (page - 1) * limit
    return alerts[start : start + limit]


@router.get("/alerts/{signal_id}", response_model=AlertSignal)
def get_alert_detail(signal_id: str, store: DataStore = Depends(get_data_store)):
    for a in store.alerts:
        if a.get("signal_id") == signal_id:
            return a
    raise HTTPException(status_code=404, detail="Sinal não encontrado")
