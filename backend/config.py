import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
RAW_DIR = DATA_DIR / "raw"
SYNTHETIC_DIR = DATA_DIR / "synthetic"
BRONZE_DIR = DATA_DIR / "bronze"
SILVER_DIR = DATA_DIR / "silver"
GOLD_DIR = DATA_DIR / "gold"

API_V1_PREFIX = "/api/v1"

_DEFAULT_CORS_ORIGINS = ["http://localhost:3000"]
_raw_cors = os.getenv("BACKEND_CORS_ORIGINS", "")
if _raw_cors.strip():
    BACKEND_CORS_ORIGINS = [o.strip() for o in _raw_cors.split(",") if o.strip()]
else:
    BACKEND_CORS_ORIGINS = _DEFAULT_CORS_ORIGINS

SEED = 42
N_MUNICIPALITIES = 80
N_CONDITIONS = 3
N_WEEKS = 156
ANOMALY_PROB = 0.03
MISSING_PROB = 0.02
DELAY_MAX_WEEKS = 3

Z_THRESHOLD_OBSERVACAO = 1.5
Z_THRESHOLD_ATENCAO = 2.0
Z_THRESHOLD_SINAL_FORTE = 2.5

RELIABILITY_WEIGHTS = {
    "baseline_sufficient": 30,
    "completeness_score": 25,
    "delay_score": 20,
    "stability_score": 15,
    "volume_score": 10,
}

PROHIBITED_TERMS = [
    "surto", "epidemia", "emergência", "colapso", "previsão",
    "paciente", "risco clínico", "alarme oficial",
]
