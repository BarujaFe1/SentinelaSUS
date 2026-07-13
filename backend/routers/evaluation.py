"""Synthetic signal evaluation against planted anomalies."""

import pandas as pd
from fastapi import APIRouter, Depends, HTTPException

from backend.dependencies import DataStore, get_data_store
from backend.pipeline.evaluation import evaluate_against_ground_truth

router = APIRouter()


@router.get("/evaluation/false-alerts")
def get_false_alert_simulation(store: DataStore = Depends(get_data_store)):
    store.load_all()
    if not store.observations:
        raise HTTPException(status_code=503, detail="Observações analíticas indisponíveis")
    if not store.ground_truth:
        raise HTTPException(
            status_code=503,
            detail="Ground truth de anomalias plantadas indisponível",
        )

    analytics = pd.DataFrame(store.observations)
    ground_truth = pd.DataFrame(store.ground_truth)
    try:
        result = evaluate_against_ground_truth(analytics, ground_truth)
    except ValueError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    # Enrich examples with human-readable names when possible.
    mun_names = {m["municipality_id"]: m.get("municipality_name", "") for m in store.municipalities}
    cond_names = {c["condition_id"]: c.get("condition_name", "") for c in store.conditions}
    for ex in result["false_positive_examples"]:
        ex["municipality_name"] = mun_names.get(ex["municipality_id"], "")
        ex["condition_name"] = cond_names.get(ex["condition_id"], "")

    result["disclaimer"] = (
        "Simulação pedagógica com dados 100% sintéticos. "
        "Não é validação clínica nem métrica de vigilância oficial."
    )
    return result
