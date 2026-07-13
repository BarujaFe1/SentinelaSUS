# Portfolio Handoff — Evidence Pass

**Branch:** `feat/portfolio-evidence-pass`  
**Base:** `chore/portfolio-quality-pass`  
**Date:** 2026-07-13  
**Repo:** https://github.com/BarujaFe1/SentinelaSUS  

## Resumo

Elevação de evidência analítica e narrativa de portfólio: metodologia visual z vs MAD, simulação de falso alerta contra ground truth plantado, memo de uso responsável, correção de claims (“rolling”), alinhamento de limiares assinados na UI de comparação.

## Before / After

| Antes | Depois |
|---|---|
| Metodologia só texto; MAD omitido na UI | Cards fórmula + série dual z/MAD + papéis oficiais |
| Ground truth CSV órfão | Endpoint + página `/simulation` com TP/FP/FN |
| Ética como página estática | Memo canônico + UI imprimível |
| Claim “rolling z-score” | Claim honesto: z sazonal (mesma semana) |
| Concordância com \|z\| | Concordância com score assinado (= backend) |
| Home com `.catch` silencioso | Erro de API visível + atalhos para simulação/memo |

## Achados priorizados (confirmados)

- **P0:** claim “rolling” falso → corrigido em API/README/UI.
- **P1:** divergência \|z\| vs z assinado na comparison → corrigido.
- **P1:** ground truth não usado → conectado à avaliação pedagógica.
- **P2:** metodologia sem visual MAD → implementado.
- **P2:** memo formal ausente → `docs/RESPONSIBLE_USE_MEMO.md` + página.
- **P3:** Playwright E2E ainda não adicionado (custo/tempo); documentado.

## Arquivos principais

- `backend/pipeline/evaluation.py`
- `backend/routers/evaluation.py`
- `backend/routers/methodology.py`
- `backend/dependencies.py` (ground_truth)
- `frontend/src/app/methodology/page.tsx`
- `frontend/src/app/simulation/page.tsx`
- `frontend/src/app/responsible-analytics/page.tsx`
- `frontend/src/app/comparison/page.tsx`
- `frontend/src/app/page.tsx`
- `tests/backend/test_evaluation.py`
- docs: `PORTFOLIO_HANDOFF`, `RESPONSIBLE_USE_MEMO`, `DEMO_WALKTHROUGH`, `SCREENSHOT_GUIDE`, `CHANGELOG`

## Comandos

```bash
python scripts/generate_synthetic_epidata.py --seed 42
python scripts/run_pipeline.py
python -m ruff check backend scripts tests
python -m pytest tests/ -q
npm --prefix frontend run lint
npx --prefix frontend tsc --noEmit -p frontend/tsconfig.json
npm --prefix frontend run build
```

## Deploy / evidência pública

- Demo atual em Vercel reflete **main** (pré evidence-pass) até merge/redeploy.
- Após merge: validar `/methodology`, `/simulation`, `/responsible-analytics` e `/api/v1/evaluation/false-alerts`.

## Limitações remanescentes

- Baseline inclui ano avaliado.
- Avaliação FP é pedagógica (planted ≠ clínico).
- Sem Playwright; sem auth.
- Screenshots novos podem precisar recaptura pós-deploy.

## Recomendação de portfólio

**Destaque (Tier A)** para vagas de analytics engineering / produto de dados / full-stack analítico — desde que a demo mostre simulação + memo + limites.

## Supermegaprompt externo

`C:\dev\prompts_para_port\sentinelasus-supermegaprompt-portfolio.md`
