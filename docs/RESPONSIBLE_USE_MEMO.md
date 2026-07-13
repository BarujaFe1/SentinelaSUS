# Memo de Uso Responsável — SentinelaSUS

**Versão:** 0.2.0  
**Data:** 2026-07-13  
**Audiência:** recrutadores, revisores técnicos, estudantes e analistas em formação  
**Classificação:** documento de portfólio / laboratório analítico  

---

## 1. Propósito

O SentinelaSUS é um **laboratório demonstrativo** de vigilância epidemiológica **sintética**.  
Ele existe para ensinar e evidenciar:

- baselining sazonal;
- sinais estatísticos interpretáveis (z-score e MAD);
- comunicação de incerteza e qualidade de dados;
- governança de linguagem em domínio sensível.

## 2. O que este sistema é

- Um dashboard + API + pipeline com dados gerados (seed 42).
- Um exercício de **analytics engineering** e **responsible analytics**.
- Uma peça de portfólio para discussão em entrevista.

## 3. O que este sistema NÃO é

- Não é vigilância epidemiológica oficial (Sinan, Sivep-Gripe, etc.).
- Não é ferramenta médica, clínica ou diagnóstica.
- Não detecta surtos reais nem recomenda política pública.
- Não prevê casos futuros.
- Não processa dados pessoais de saúde (não há PII real).

## 4. Como interpretar um “alerta”

1. Um **sinal** indica desvio em relação ao baseline histórico sintético.
2. O nível oficial usa **z-score assinado** (não |z|).
3. O **MAD** é comparador robusto — não substitui sozinho a classificação do produto.
4. **Reliability** e flags de qualidade modulam a confiança na leitura.
5. Sem investigação de campo (inexistente neste lab), nenhum sinal “confirma” evento.

## 5. Falsos alertas (simulação pedagógica)

A página `/simulation` compara sinais detectados com anomalias **plantadas** no gerador.  
Falsos positivos ilustram ruído estatístico esperado.  
Isso **não** é validação clínica; é evidência de que thresholds geram trade-offs.

## 6. Regras de linguagem

| Preferir | Evitar |
|---|---|
| sinal estatístico | surto detectado |
| variação acima do esperado | epidemia confirmada |
| baseline histórico | alarme oficial |
| requer revisão técnica | recomendação médica |
| dados sintéticos | vigilância oficial |

O brief executivo bloqueia termos proibidos em código (`PROHIBITED_TERMS`).

## 7. Proveniência dos dados

- Gerador: `scripts/generate_synthetic_epidata.py` (seed configurável; demo = 42).
- Camadas: bronze → silver → gold (`scripts/run_pipeline.py`).
- Ground truth de anomalias: `data/synthetic/anomaly_ground_truth.csv` (gitignored binários; regenerável).
- Metadados expostos em `/api/v1/demo/metadata` e `/api/v1/methodology`.

## 8. Limitações metodológicas honestas

- Baseline da mesma semana epidemiológica **inclui o ano avaliado** (MVP; leave-one-out no roadmap).
- Z-score assume resíduos aproximadamente normais.
- Amostra curta por município×condição×semana.
- API pública GET-only, sem autenticação (adequado a demo, não a dados reais).

## 9. Uso permitido

- Demonstração de portfólio e entrevistas.
- Ensino de conceitos de séries temporais e detecção.
- Experimentos com seed e thresholds em ambiente local.

## 10. Uso proibido

- Tomada de decisão em saúde pública real.
- Marketing que implique certificação sanitária ou parceria oficial com SUS/MS.
- Publicação de resultados como se fossem epidemiológicos oficiais.

## 11. Contato / autoria

**Felipe Alirio Baruja** — estudante de Estatística/Ciência de Dados (USP); desenvolvedor de software.  
Repositório: https://github.com/BarujaFe1/SentinelaSUS  

---

*Ao usar, citar ou demonstrar este projeto, preserve os avisos de dados sintéticos e anti-escopo.*
