from fastapi import APIRouter, Depends

from backend.dependencies import DataStore, get_data_store

router = APIRouter()


@router.get("/demo/metadata")
def get_demo_metadata(store: DataStore = Depends(get_data_store)):
    return store.metadata
