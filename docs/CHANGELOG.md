# Changelog — SentinelaSUS

## 0.2.0 — 2026-07-13 (feat/portfolio-evidence-pass)

### Added
- Metodologia visual: fórmulas z vs MAD, papéis (oficial vs comparador), gráfico dual.
- Simulação de falso alerta: `GET /api/v1/evaluation/false-alerts` + página `/simulation`.
- Memo de uso responsável: `docs/RESPONSIBLE_USE_MEMO.md` + UI imprimível.
- Testes de regressão: `tests/backend/test_evaluation.py` + endpoint.
- Docs: `PORTFOLIO_HANDOFF`, `DEMO_WALKTHROUGH`, `SCREENSHOT_GUIDE`.

### Fixed
- Claim incorreto de “rolling z-score” (agora: sazonal / mesma semana).
- Concordância na comparison usava `|z|`; alinhada ao detector (score assinado).
- Home engolia erro de overview silenciosamente.

### Changed
- API description/version → 0.2.0 com anti-escopo explícito.
- DataStore carrega `anomaly_ground_truth.csv`.

## 0.1.x — quality pass anterior

Ver `docs/HANDOFF.md` (branch `chore/portfolio-quality-pass`).
