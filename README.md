# SentinelaSUS

**Painel responsável de vigilância epidemiológica sintética para detectar sinais estatísticos incomuns em séries temporais municipais.**

> ⚠️ **Aviso importante**: Este projeto usa **dados 100% sintéticos** para fins demonstrativos. Não substitui sistemas oficiais de vigilância epidemiológica. Não faz diagnóstico, recomendação clínica ou previsão de casos.

---

## Problema

Municípios e equipes técnicas podem ter dados epidemiológicos agregados, mas frequentemente enfrentam séries ruidosas, subnotificação, atraso de notificação, sazonalidade e dificuldade de interpretar variações. Dashboards tradicionais mostram números, mas não incerteza.

**SentinelaSUS transforma séries temporais agregadas em sinais estatísticos interpretáveis, com alertas responsáveis e limites explícitos.**

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Recharts |
| Backend | Python 3.12, FastAPI, Pydantic, Pandas, NumPy, SciPy |
| Dados | CSV sintético, Parquet processado |
| Testes | pytest, ruff, ESLint |

## Estrutura

```
sentinelasus/
├── backend/          # FastAPI + pipeline
├── frontend/         # Next.js 16
├── data/             # Dados (raw → bronze → silver → gold)
├── scripts/          # Geração e pipeline
├── docs/             # Metodologia, premissas, dicionário
└── tests/            # Testes pytest
```

## Como executar

### 1. Dados sintéticos

```bash
cd sentinelasus
pip install -e ".[dev]"
python scripts/generate_synthetic_epidata.py --seed 42
```

### 2. Pipeline

```bash
python scripts/run_pipeline.py
```

### 3. Backend

```bash
uvicorn backend.main:app --reload --port 8000
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Dataset sintético

- 80 municípios fictícios (3 portes: small, medium, large)
- 3 condições epidemiológicas sintéticas
- 156 semanas (~3 anos) de histórico semanal
- Sazonalidade, ruído, atraso, subnotificação e anomalias controladas
- Seed reproduzível para validação

## Metodologia

- **Baseline**: média histórica por semana epidemiológica (janela ±2 semanas, mínimo 3 observações)
- **Detecção**: rolling z-score (padrão) + MAD robusto (comparação)
- **Alert levels**: normal, observação, atenção, sinal forte, não interpretável
- **Reliability score**: score composto 0-100 (baseline, completude, atraso, estabilidade, volume)

Detalhes em [docs/methodology.md](docs/methodology.md).

## Antiescopo

SentinelaSUS explicitamente **não**:
- Usa dados reais sensíveis ou identificáveis
- Faz previsão de casos futuros
- Faz diagnóstico ou recomendação clínica
- Substitui vigilância epidemiológica oficial
- Usa linguagem alarmista ("surto", "epidemia", "emergência")
- Integra sistemas oficiais (Sinan, Sivep, DATASUS)
- Usa modelos complexos (SIR, Prophet, LSTM, IA generativa)

## Telas

- **Home**: contexto e aviso de dados sintéticos
- **Surveillance Overview**: KPIs e distribuição de alertas
- **Time Series Explorer**: série temporal com baseline e bandas
- **Alert Center**: lista de sinais com nível e confiabilidade
- **Municipality Detail**: análise por município (via link nos alertas)
- **Data Quality Center**: problemas de qualidade
- **Executive Brief**: relatório determinístico
- **Method Comparison**: z-score vs MAD robusto
- **Methodology & Limits**: documentação metodológica
- **Responsible Analytics**: princípios éticos

## Testes

```bash
pytest tests/
```

## Licença

MIT

---

## Deploy em produção

O projeto é composto por dois serviços independentes: um backend FastAPI e um frontend Next.js.

### Backend (Render)

1. Crie um novo **Web Service** no [Render](https://render.com) apontando para este repositório.
2. Use as configurações abaixo (também descritas em `render.yaml`):
   - **Runtime**: Python 3.12
   - **Build Command**: `pip install -r requirements.txt && python scripts/generate_synthetic_epidata.py --seed 42 && python scripts/run_pipeline.py`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
   - **Health Check Path**: `/health`
3. Em **Environment**, defina `BACKEND_CORS_ORIGINS` com a URL do frontend (ex.: `https://sentinela.vercel.app,http://localhost:3000`).
4. O build regenera os dados sintéticos deterministicamente (seed 42), então nada de binário é versionado.

Alternativamente, use o `Procfile` (`web: uvicorn backend.main:app --host 0.0.0.0 --port $PORT`) ou `python run.py` localmente.

### Backend alternativo (Vercel Python)

Se preferir publicar a API na Vercel (sem Render):

1. Faça deploy da raiz do repositório (`vercel --prod`).
2. O `vercel.json` instala dependências, gera dados sintéticos (seed 42) e sobe o entrypoint `api/index.py`.
3. Defina `BACKEND_CORS_ORIGINS` com a URL do frontend.

### Frontend (Vercel)

1. Importe o repositório na [Vercel](https://vercel.com) **ou** faça deploy a partir de `frontend/`.
2. Defina **Root Directory** como `frontend`.
3. Em **Environment Variables**, defina `NEXT_PUBLIC_API_URL` com a URL do backend (Render ou Vercel).
4. O `next build` usa essa variável em tempo de build; ao trocar de backend, refaça o deploy.

### Testes

```bash
# Backend
pip install -e ".[dev]"
pytest tests/

# Frontend
cd frontend
npm install
npm run lint
npm run build
```

> Observação: os dados (`data/`) são ignorados no `.gitignore` e recriados no build do backend.

