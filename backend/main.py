
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.config import API_V1_PREFIX, BACKEND_CORS_ORIGINS
from backend.routers import (
    alerts,
    brief,
    conditions,
    demo,
    methodology,
    municipalities,
    overview,
    quality,
    timeseries,
)

app = FastAPI(
    title="SentinelaSUS",
    description="Painel responsável de vigilância epidemiológica sintética",
    version="0.1.0",
    docs_url="/docs",
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(demo.router, prefix=API_V1_PREFIX, tags=["demo"])
app.include_router(overview.router, prefix=API_V1_PREFIX, tags=["overview"])
app.include_router(timeseries.router, prefix=API_V1_PREFIX, tags=["timeseries"])
app.include_router(alerts.router, prefix=API_V1_PREFIX, tags=["alerts"])
app.include_router(quality.router, prefix=API_V1_PREFIX, tags=["quality"])
app.include_router(municipalities.router, prefix=API_V1_PREFIX, tags=["municipalities"])
app.include_router(conditions.router, prefix=API_V1_PREFIX, tags=["conditions"])
app.include_router(brief.router, prefix=API_V1_PREFIX, tags=["brief"])
app.include_router(methodology.router, prefix=API_V1_PREFIX, tags=["methodology"])


@app.get("/health")
def health_check():
    return {"status": "ok", "project": "SentinelaSUS", "version": "0.1.0"}
