# Audit Report — SentinelaSUS

**Branch:** `chore/portfolio-quality-pass`  
**Date:** 2026-07-13  
**Auditor:** Cursor portfolio quality pass  

## Resumo executivo

O SentinelaSUS é um produto full-stack coerente (gerador sintético → pipeline bronze/silver/gold → FastAPI tipada → Next.js) com narrativa forte de Responsible Analytics. A peça já está publicada (GitHub + Vercel), com CI, banners de dados sintéticos e anti-escopo explícito.

Os maiores riscos de credibilidade para portfólio são: (1) empacotamento frágil dos dados gold no deploy Vercel; (2) página `/comparison` estática apesar da promessa “z-score vs MAD”; (3) documentação de baseline desalinhada do código; (4) UX mobile/a11y ainda MVP.

**Nota pré-pass: 7.5 / 10**  
**Nota pós-pass (estimada): 8.6 / 10** — bugs críticos corrigidos, comparison interativa, docs honestas, CI/UX reforçadas.

## Principais riscos

| Severidade | Risco |
|---|---|
| Alta | Gold parquet gitignored + scripts excluídos do Vercel → API pode subir sem dados |
| Alta | Baseline docs ≠ código (`use_expected=True`, sem janela ±2) |
| Média | Brief usa `assert` (some com `python -O`) |
| Média | Sidebar fixa `w-64` — mobile quebrado |
| Média | Explorer/home/methodology engolem erros de fetch |
| Baixa | Filtro “normal” em alertas nunca retorna linhas |

## Quick wins

1. Empacotar/gerar dados no build da API Vercel de forma confiável  
2. Comparison interativa (z vs MAD) com dados reais  
3. Estados de erro/empty + labels a11y  
4. Trocar `assert` por erro explícito no brief  
5. Alinhar docs de metodologia ao código  
6. Sidebar mobile + highlight de rotas aninhadas  
7. `httpx` (não `httpx2`) no CI/dev  
8. Mostrar `total_quality_issues` no overview; nomes de condição no detalhe municipal  

## Melhorias estruturais

- Baseline leave-one-out / anos anteriores (quando amostra permitir)  
- Paginação forte em timeseries  
- Skeletons e primitives UI compartilhados  
- Testes Playwright smoke  
- CONTRIBUTING + ADRs  

## Bugs encontrados

1. Brief: `assert` para termos proibidos  
2. Overview: variável `a` enganosa no set de municípios  
3. Municipality detail: truncagem de `condition_id` em vez do nome  
4. Alerts: opção filtro `normal` inútil  
5. Comparison: stub estático  
6. Deploy: includeFiles de gold sem binários no git  
7. Silent `.catch(() => {})` em explorer/home/methodology  

## Plano de execução

1. Documentar auditoria (este arquivo)  
2. Corrigir bugs + UX + comparison  
3. Docs técnicas (ARCHITECTURE, TESTING, DEPLOYMENT, TECHNICAL_DECISIONS)  
4. CI/README/HANDOFF  
5. Validar ruff/pytest/lint/build  
6. Commit + push da branch  

## Checklist final

- [x] Projeto instala e testa (40 pytest + ruff)  
- [x] Build frontend OK  
- [x] Bugs principais corrigidos  
- [x] README forte (portfólio + entrevista)  
- [x] Docs criadas  
- [x] CI atualizada  
- [x] `.env.example` / `.gitignore` OK  
- [x] HANDOFF.md  
- [x] Branch publicada (`origin/chore/portfolio-quality-pass` @ `fa3b2c6`)  
