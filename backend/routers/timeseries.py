from fastapi import APIRouter, Depends, Query

from backend.dependencies import DataStore, get_data_store
from backend.schemas.observation import ObservationAnalytics

router = APIRouter()


@router.get("/timeseries", response_model=list[ObservationAnalytics])
def get_timeseries(
    municipality_id: str | None = Query(None),
    condition_id: str | None = Query(None),
    start_week: int | None = Query(None),
    end_week: int | None = Query(None),
    start_year: int | None = Query(None),
    end_year: int | None = Query(None),
    store: DataStore = Depends(get_data_store),
):
    obs = store.observations
    if municipality_id:
        obs = [o for o in obs if o.get("municipality_id") == municipality_id]
    if condition_id:
        obs = [o for o in obs if o.get("condition_id") == condition_id]
    if start_week is not None:
        obs = [o for o in obs if (o.get("epidemiological_week") or 0) >= start_week]
    if end_week is not None:
        obs = [o for o in obs if (o.get("epidemiological_week") or 0) <= end_week]
    if start_year is not None:
        obs = [o for o in obs if (o.get("year") or 0) >= start_year]
    if end_year is not None:
        obs = [o for o in obs if (o.get("year") or 0) <= end_year]
    return obs
