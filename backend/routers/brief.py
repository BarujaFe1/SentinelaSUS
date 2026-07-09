
from fastapi import APIRouter, Depends, Query

from backend.dependencies import DataStore, get_data_store
from backend.pipeline.brief_generator import generate_brief
from backend.schemas.brief import ReportBrief

router = APIRouter()


@router.get("/brief", response_model=ReportBrief)
def get_brief(
    municipality_id: str | None = Query(None),
    condition_id: str | None = Query(None),
    store: DataStore = Depends(get_data_store),
):
    return generate_brief(store, municipality_id, condition_id)
