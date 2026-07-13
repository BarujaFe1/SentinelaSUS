# Deployment — SentinelaSUS

## Produção atual

| Serviço | URL |
|---|---|
| Frontend | https://sentinelasus.vercel.app |
| API | https://sentinelasus-api.vercel.app |
| Health | https://sentinelasus-api.vercel.app/health |

## Frontend (Vercel)

1. Root Directory: `frontend`
2. Env: `NEXT_PUBLIC_API_URL=https://sentinelasus-api.vercel.app`
3. Build: `npm run build`

## API (Vercel Python)

1. Deploy da **raiz** do repo (`vercel --prod`)
2. `vercel.json` executa no install:
   - `pip install -r requirements.txt`
   - `generate_synthetic_epidata.py --seed 42`
   - `run_pipeline.py`
3. Env: `BACKEND_CORS_ORIGINS=https://sentinelasus.vercel.app,http://localhost:3000`

## Render (opcional)

Blueprint: `render.yaml`  
Deeplink: https://dashboard.render.com/blueprint/new?repo=https://github.com/BarujaFe1/SentinelaSUS

## Checklist pós-deploy

- [ ] `GET /health` → 200  
- [ ] `GET /api/v1/overview` → municípios=80  
- [ ] Frontend overview carrega KPIs  
- [ ] CORS permite origem do frontend  
- [ ] Aviso de dados sintéticos visível  
