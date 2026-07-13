# Handoff — Portfolio Quality Pass

**Branch:** `chore/portfolio-quality-pass`  
**Date:** 2026-07-13  
**Repo:** https://github.com/BarujaFe1/SentinelaSUS  

## O que foi encontrado

- Produto já forte (pipeline → API → dashboard → Vercel), nota de auditoria **7.5/10**.
- Gaps de credibilidade: baseline documentada ≠ código; `/comparison` estática; brief com `assert`; sidebar mobile; estados de erro silenciosos; empacotamento Vercel frágil; `httpx2` no CI.
- Lacuna de portfólio: falta de docs de arquitetura/testes/deploy e seções de entrevista no README.

## O que foi corrigido

| Item | Correção |
|---|---|
| Brief `assert` | `ValueError` + HTTP 500 no router |
| Baseline | `reported_cases` por padrão; limitação MVP documentada |
| Docs methodology | Alinhadas ao código (`known_limitation`) |
| Comparison | Scatter z vs MAD, acordo %, correlação, filtros |
| Sidebar mobile | Drawer + overlay; fecha no clique de navegação |
| Explorer / methodology / alerts / quality | Loading, error, empty states |
| Overview | KPI `total_quality_issues` |
| Municipality detail | Nomes de condição; label “Sinais Históricos” |
| Alerts filter | Removido filtro inútil `normal` |
| CI / deps | `httpx` (não `httpx2`); trigger `chore/**`; `tsc --noEmit` |
| Vercel API | `installCommand` gera seed 42 + pipeline; include gold/synthetic |
| Lint React | Removido `setState` em `useEffect` no Sidebar |

## O que foi melhorado

- Documentação: `AUDIT_REPORT`, `ARCHITECTURE`, `TECHNICAL_DECISIONS`, `TESTING`, `DEPLOYMENT`, methodology, README (status, trade-offs, entrevista).
- UX de responsabilidade: banners, empty states, labels a11y, narrativa de incerteza.
- Teste novo: `tests/backend/test_baselines.py`.
- `.env.example` com exemplos de produção.

## Comandos rodados

```text
python scripts/generate_synthetic_epidata.py --seed 42
python scripts/run_pipeline.py
python -m ruff check backend scripts tests
python -m pytest tests/ -q
npm --prefix frontend run lint
npx --prefix frontend tsc --noEmit -p frontend/tsconfig.json
npm --prefix frontend run build
```

## Testes executados

- **Ruff:** all checks passed  
- **Pytest:** 40 passed  
- **ESLint:** ok (após fix Sidebar)  
- **TypeScript:** ok (via build + tsc)  
- **Next build:** 12 rotas OK  

## O que ainda falta

- Baseline leave-one-out (quando amostra permitir)
- Playwright smoke E2E
- Export PDF do brief
- Mapas municipais
- Skeletons compartilhados / design system leve
- Auth/rate-limit se a API crescer além de demo pública

## Riscos restantes

| Risco | Mitigação atual |
|---|---|
| Cold start Vercel regenera dados no install | Determinístico seed 42; ainda assim cold start mais lento |
| Baseline inclui ano avaliado | Documentado em methodology + API `known_limitation` |
| API pública sem auth | Aceitável para demo; não usar com dados reais |
| Screenshots do README podem envelhecer | Regenerar após mudanças visuais grandes |

## Próximos passos

1. Abrir PR `chore/portfolio-quality-pass` → `main`
2. Validar CI no GitHub
3. Redeploy Vercel (frontend + API) se necessário após merge
4. (Opcional) Render Blueprint manual — sem API key automatizada
5. Gravar 2–3 min de walkthrough para LinkedIn/portfolio

## Sugestões para o portfólio

- Abrir a demo com **Responsible Analytics** e **Comparison** (mostra maturidade estatística).
- Em entrevista: explicar trade-off da baseline MVP e por que brief é determinístico.
- Destacar CI regenerando seed 42 — prova de reprodutibilidade.

## Mensagem de commit sugerida

```text
chore: improve portfolio quality, docs, tests and stability
```

## Aviso de responsabilidade

Dados 100% sintéticos. Não é ferramenta médica ou epidemiológica oficial. Sinais são estatísticos e interpretáveis, com incerteza e qualidade de dados explícitas.
