<div align="center">
  <img src="./assets/icon.png" alt="SentinelaSUS Logo" width="120" height="120" />

  <h1>SentinelaSUS</h1>

  <p><strong>Painel responsável de vigilância epidemiológica sintética com sinais estatísticos interpretáveis.</strong></p>
  <p><strong>Responsible synthetic epidemiological surveillance with interpretable statistical signals.</strong></p>

  <p>
    <a href="#pt-br">PT-BR</a>
     · 
    <a href="#english">English</a>
     · 
    <a href="#live-demo">Live Demo</a>
     · 
    <a href="#stack">Stack</a>
     · 
    <a href="#architecture">Architecture</a>
     · 
    <a href="#quick-start">Quick Start</a>
     · 
    <a href="#author">Author</a>
  </p>

  <p>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
    <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
    <img alt="Python" src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
    <img alt="Recharts" src="https://img.shields.io/badge/Recharts-FF7300?style=for-the-badge" />
    <img alt="Status-Lab%20demo" src="https://img.shields.io/badge/Status-Lab%20demo-22C55E?style=for-the-badge" />
    <img alt="License-MIT" src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />
  </p>

  <p>
    <a href="https://sentinelasus.vercel.app"><strong>Live Demo</strong></a>
     · 
    <a href="https://github.com/BarujaFe1/SentinelaSUS"><strong>Repo</strong></a>
     · 
    <a href="https://barujafe.vercel.app/"><strong>Portfolio</strong></a>
     · 
    <a href="https://www.linkedin.com/in/barujafe/"><strong>LinkedIn</strong></a>
  </p>
</div>


<p align="center">
  <img src="./assets/hero-cover.png" alt="SentinelaSUS overview" width="100%" />
</p>

> **Responsible analytics notice:** uses **synthetic** epidemiological-style data. Alerts and reliability scores are **statistical decision-support**, not clinical diagnosis, outbreak confirmation or SUS production systems.

---

## PT-BR

### Visão geral
O **SentinelaSUS** é um lab full-stack (FastAPI + Next.js) de vigilância sintética: overview, séries temporais, central de alertas, score de confiabilidade, qualidade de dados e briefing executivo.

### Problema
Painéis epidemiológicos amadores misturam dado real, sem qualidade nem limite ético — e “alertas” sem método viram ruído ou medo.

### Para quem
Estudantes e profissionais de dados/saúde que querem treinar **vigilância responsável** com métodos interpretáveis em ambiente sintético.

### Funcionalidades
- Overview de vigilância e KPIs
- Explorador de séries temporais
- Alert center com sinais interpretáveis
- Reliability / data-quality views
- Executive brief e comparação de métodos (conforme UI do lab)
- Pipeline de dados sintéticos + API Python

### Escopo e limites (honestos)
- **Dados sintéticos** — não é feed oficial do SUS
- Não diagnostica, não dispara resposta sanitária real
- Lab demo público ≠ sistema de vigilância em produção

---

## English

### Overview
**SentinelaSUS** is a FastAPI + Next.js lab for synthetic surveillance: overview, time series, alert center, reliability score, data quality and an executive brief.

### Problem
Amateur epi dashboards mix real data without quality or ethical limits — and method-free “alerts” become noise or fear.

### Who it is for
Data/health learners who want to practice **responsible surveillance** with interpretable methods on synthetic data.

### Features
- Surveillance overview and KPIs
- Time-series explorer
- Alert center with interpretable signals
- Reliability / data-quality views
- Executive brief and method comparison (as implemented in the lab UI)
- Synthetic data pipeline + Python API

### Scope and honest limits
- **Synthetic data** — not an official SUS feed
- Does not diagnose or trigger real public-health response
- Public lab ≠ production surveillance system

---

## Live Demo

| Surface | URL |
|---|---|
| **Public lab** | [https://sentinelasus.vercel.app](https://sentinelasus.vercel.app) |
| **GitHub** | see Repo badge above |

**How to try:** open the lab → review overview KPIs → explore a series → inspect alerts/reliability → read the executive brief.



## Screenshots

<table>
  <tr>
    <td width="50%"><img src="./assets/screenshots/01-home-hero.png" alt="Home" /><br /><sub><strong>Home</strong></sub></td>
    <td width="50%"><img src="./assets/screenshots/02-overview-kpis.png" alt="Overview KPIs" /><br /><sub><strong>Overview KPIs</strong></sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="./assets/screenshots/03-timeseries-explorer.png" alt="Time series" /><br /><sub><strong>Time series</strong></sub></td>
    <td width="50%"><img src="./assets/screenshots/04-alert-center.png" alt="Alert center" /><br /><sub><strong>Alert center</strong></sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="./assets/screenshots/05-data-quality.png" alt="Data quality" /><br /><sub><strong>Data quality</strong></sub></td>
    <td width="50%"><img src="./assets/hero-cover.png" alt="Hero" /><br /><sub><strong>Hero</strong></sub></td>
  </tr>
</table>



## Stack

| Layer | Technology |
|---|---|
| Web | Next.js, React, TypeScript, Tailwind, Recharts |
| API | FastAPI, Pandas, NumPy, Pydantic |
| Deploy | Vercel (`vercel.json`), optional Render (`render.yaml`) |

---

## Architecture

```txt
frontend/     Next.js UI
api/ | backend/   FastAPI services
data/         synthetic datasets
scripts/      generation / pipeline helpers
tests/        pytest
```

Flow: synthetic events → aggregate → signal rules/stats → dashboard + brief.

---

## Quick Start

**Prerequisites:** Node.js 20+, Python 3.10+.

```bash
# data + API (see repo scripts / run.py)
pip install -r requirements.txt
python run.py
# or: uvicorn on the api package as documented in-repo

cd frontend
npm install
npm run dev
```

---

## Technical decisions

- **Synthetic-first** to avoid leaking real health microdata in a portfolio lab
- **Interpretable signals** over black-box “AI outbreak” claims
- Split UI/API so methods stay testable in Python

---

## Roadmap

- More method cards and clearer uncertainty messaging
- Stronger data-quality drills
- Deeper demo scripts for interviews

---

## Author

**Felipe Alirio Baruja** — data / product / full-stack portfolio.

- Portfolio: [https://barujafe.vercel.app/](https://barujafe.vercel.app/)
- GitHub: [https://github.com/BarujaFe1](https://github.com/BarujaFe1)
- LinkedIn: [https://www.linkedin.com/in/barujafe/](https://www.linkedin.com/in/barujafe/)


## License

MIT — see [`LICENSE`](./LICENSE).
