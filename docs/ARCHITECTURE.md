# Architecture — SentinelaSUS

## Visão geral

Monorepo com três camadas:

1. **Geração + pipeline** (`scripts/`) — dataset sintético determinístico e camadas bronze/silver/gold.
2. **API** (`backend/`) — FastAPI + Pydantic, DataStore em memória a partir de Parquet gold.
3. **UI** (`frontend/`) — Next.js App Router consumindo `NEXT_PUBLIC_API_URL`.

```txt
scripts/generate_synthetic_epidata.py
        ↓
scripts/run_pipeline.py  (bronze → silver → gold)
        ↓
backend.dependencies.DataStore
        ↓
backend.routers.*  (/api/v1/*)
        ↓
frontend/src/lib/api.ts
        ↓
pages (overview, explorer, alerts, quality, brief, comparison, ...)
```

## Contratos

- Respostas validadas por `response_model` Pydantic.
- Tipagem espelhada em `frontend/src/lib/types.ts`.
- Termos proibidos em `backend/config.py::PROHIBITED_TERMS` (brief).

## Deploy

- Frontend: Vercel (`frontend/`).
- API: Vercel Python (`api/index.py` + `vercel.json`), com geração seed 42 no `installCommand`.
- Opcional: Render Blueprint (`render.yaml`).

## Decisões-chave

Ver `docs/TECHNICAL_DECISIONS.md`.
