from fastapi import APIRouter, Depends

from backend.dependencies import DataStore, get_data_store
from backend.schemas.condition import Condition

router = APIRouter()


@router.get("/conditions", response_model=list[Condition])
def get_conditions(store: DataStore = Depends(get_data_store)):
    return store.conditions
