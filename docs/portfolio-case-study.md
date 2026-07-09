# Case Study — SentinelaSUS

## Headline

**SentinelaSUS — Vigilância epidemiológica sintética com séries temporais e alertas responsáveis**

## Resumo

Produto analítico que usa séries semanais sintéticas para identificar sinais estatísticos incomuns, avaliar qualidade do dado e gerar relatórios responsáveis para monitoramento exploratório em saúde pública.

## Contexto

Municípios e equipes técnicas podem ter dados epidemiológicos agregados, mas frequentemente enfrentam séries ruidosas, subnotificação, atraso de notificação, sazonalidade e dificuldade de interpretar variações. Dashboards tradicionais mostram números, mas não incerteza.

SentinelaSUS transforma séries temporais agregadas em sinais estatísticos interpretáveis, com alertas responsáveis e limites explícitos.

## Problema

- Séries temporais ruidosas e com subnotificação
- Falta de baseline histórico claro
- Alertas sem explicação metodológica
- Risco de conclusões alarmistas

## Solução

- Dataset sintético reproduzível com 80 municípios, 3 condições, 156 semanas
- Baseline histórico semanal com janela móvel
- Detecção por rolling z-score + MAD robusto (comparação)
- Alert levels com thresholds explícitos
- Reliability score (0-100) com componentes explicáveis
- Data Quality Center para atraso, incompletude e séries não interpretáveis
- Executive Brief determinístico com limitações
- Interface responsável com linguagem não clínica

## Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Recharts
- **Backend**: Python 3.12, FastAPI, Pydantic, Pandas, NumPy, PyArrow
- **Dados**: CSV sintético → Parquet processado
- **Testes**: pytest, ruff, seed reproduzível

## Resultados

- Pipeline de dados funcional com 4 camadas (raw → bronze → silver → gold)
- Baseline calculado para todos os municípios e condições
- Alertas classificados em 5 níveis com score de confiabilidade
- Interface com 9 telas consumindo API REST
- Brief executivo sem linguagem clínica
- 100% dados sintéticos — sem exposição a dados reais

## Limitações

- Dados sintéticos não representam notificações reais
- Z-score assume normalidade dos resíduos
- Baseline limitado a 2-3 anos
- Sem validação externa
- Sem integração com sistemas oficiais

## Aprendizados

- Como gerar séries temporais sintéticas realistas com sazonalidade e ruído
- Como implementar detecção de anomalias explicável
- Como comunicar incerteza e limites em dashboards
- Como projetar interface para domínio sensível

## Links

- Repositório: [https://github.com/BarujaFe1/SentinelaSUS](https://github.com/BarujaFe1/SentinelaSUS)
- Live: [https://sentinelasus.vercel.app](https://sentinelasus.vercel.app)
- API: [https://sentinelasus-api.vercel.app](https://sentinelasus-api.vercel.app)
- README: instruções de execução
