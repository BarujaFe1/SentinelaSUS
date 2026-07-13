# Screenshot Guide — SentinelaSUS

Capturar **após** merge/redeploy da `feat/portfolio-evidence-pass` (ou localmente com API + frontend).

## Ambiente

```bash
# terminal 1
uvicorn backend.main:app --reload --port 8000
# terminal 2
cd frontend && npm run dev
```

Viewport desktop: 1440×900. Mobile: 390×844.

## Checklist de capturas (sem PII — tudo sintético)

| Arquivo sugerido | Rota | Nota |
|---|---|---|
| `assets/screenshots/01-home.png` | `/` | Banner sintético visível |
| `assets/screenshots/02-overview-kpis.png` | `/overview` | Já pode existir |
| `assets/screenshots/03-explorer.png` | `/explorer` | Série + baseline |
| `assets/screenshots/04-methodology-visual.png` | `/methodology` | Dual chart z/MAD |
| `assets/screenshots/05-comparison-scatter.png` | `/comparison` | Com filtros selecionados |
| `assets/screenshots/06-simulation-fp.png` | `/simulation` | Cards TP/FP + tabela |
| `assets/screenshots/07-responsible-memo.png` | `/responsible-analytics` | Memo |
| `assets/screenshots/08-mobile-sidebar.png` | qualquer | Menu mobile aberto |

## Social preview

`assets/social-preview.png` — 1280×640, &lt;1MB. Upload em Settings → Social preview.

## Nota

Se `assets/` estiver ausente no clone local, regenerar a partir do histórico git ou recapturar. Não incluir dados reais nunca.
