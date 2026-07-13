# Testing — SentinelaSUS

## Backend

```bash
pip install -r requirements.txt
pip install pytest ruff httpx
python scripts/generate_synthetic_epidata.py --seed 42
python scripts/run_pipeline.py
ruff check backend scripts tests
pytest tests/ -q
```

Cobertura atual (`tests/backend/`):
- contratos de endpoints (schema, filtros, 404)
- detector (z-score e thresholds)
- reliability score
- linguagem do brief (termos proibidos)
- gerador sintético (seed/reprodutibilidade)
- baselines (`reported_cases`, suficiência)

## Frontend

```bash
cd frontend
npm install
npm run lint
npx tsc --noEmit
npm run build
```

Não há testes e2e ainda. Smoke manual: home → overview → alerts → comparison.

## CI

`.github/workflows/ci.yml` roda backend (ruff + pipeline + pytest) e frontend (lint + tsc + build) em push/PR.
