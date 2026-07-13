from fastapi import APIRouter, Depends, HTTPException

from backend.dependencies import DataStore, get_data_store
from backend.schemas.municipality import Municipality, MunicipalitySummary

router = APIRouter()


@router.get("/municipalities", response_model=list[Municipality])
def get_municipalities(store: DataStore = Depends(get_data_store)):
    return store.municipalities


@router.get("/municipalities/{municipality_id}/summary", response_model=MunicipalitySummary)
def get_municipality_summary(municipality_id: str, store: DataStore = Depends(get_data_store)):
    mun = None
    for m in store.municipalities:
        if m.get("municipality_id") == municipality_id:
            mun = m
            break
    if not mun:
        raise HTTPException(status_code=404, detail="Município não encontrado")

    obs = [o for o in store.observations if o.get("municipality_id") == municipality_id]
    alerts = [a for a in store.alerts if a.get("municipality_id") == municipality_id]

    conditions = set(o.get("condition_id") for o in obs)
    weeks = set((o.get("year"), o.get("epidemiological_week")) for o in obs)
    completeness = [o.get("completeness_score", 1.0) for o in obs]
    delays = [o.get("delayed_reports", 0) for o in obs]
    reliability = [
        a.get("reliability_score", 0)
        for a in alerts
        if a.get("reliability_score") is not None
    ]

    # active_alerts = sinais históricos do município (não apenas semana atual).
    return MunicipalitySummary(
        municipality=Municipality(**mun),
        total_conditions=len(conditions),
        total_weeks=len(weeks),
        active_alerts=len(alerts),
        average_completeness=(
            round(sum(completeness) / len(completeness), 2) if completeness else 0.0
        ),
        average_delay=round(sum(delays) / len(delays), 2) if delays else 0.0,
        overall_reliability=round(sum(reliability) / len(reliability), 1) if reliability else 0.0,
    )
