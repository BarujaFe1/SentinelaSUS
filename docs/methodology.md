# Metodologia — SentinelaSUS

## O que é

SentinelaSUS é um painel de vigilância epidemiológica sintética que detecta sinais estatísticos incomuns em séries temporais municipais. Ele não substitui sistemas oficiais de vigilância.

## Dados sintéticos

Todos os dados são gerados artificialmente com seed reproduzível. Características:
- 80 municípios fictícios com portes variados (small, medium, large)
- 3 condições epidemiológicas sintéticas com perfis de sazonalidade distintos
- 156 semanas (~3 anos) de histórico semanal
- Sazonalidade modelada como senoide anual
- Ruído Poissoniano
- Atraso de notificação simulado
- Subnotificação e semanas ausentes
- Anomalias pontuais e sustentadas inseridas controladamente

## Baseline histórico

Para cada município, condição e semana epidemiológica:

`baseline_mean = média dos reported_cases na mesma semana epidemiológica ao longo dos anos disponíveis`

`baseline_std = desvio padrão amostral correspondente`

`baseline_median` / `baseline_mad` alimentam o score robusto (MAD).

Exigência mínima: **3 observações** na agregação. Abaixo disso, o sinal é classificado como "não interpretável".

### Limitação explícita (MVP)

A implementação atual agrega **todos os anos** daquela semana epidemiológica (incluindo o ano sob avaliação). Isso introduz dependência leve entre observação e baseline. Para o dataset sintético de demonstração isso é aceitável e está documentado; leave-one-out / janela ±2 semanas permanece no roadmap.

## Rolling z-score

`z_score = (observed_cases - baseline_mean) / max(baseline_std, 0.1)`

Interpretação:
- z < 1.5: normal
- 1.5 ≤ z < 2.0: observação
- 2.0 ≤ z < 2.5: atenção
- z ≥ 2.5: sinal forte

## Score robusto (MAD)

Alternativa usando mediana e MAD (Median Absolute Deviation):

`robust_score = (observed_cases - baseline_median) / (MAD * 1.4826)`

Usado como comparação metodológica na UI `/comparison`.

## Alert levels

- **normal**: sem sinal estatístico relevante
- **observação**: variação acima do esperado, baixa intensidade
- **atenção**: sinal estatístico moderado com dados suficientes
- **sinal forte**: desvio elevado com boa confiabilidade
- **não interpretável**: dados insuficientes para interpretar

## Reliability score

Score composto de 0 a 100:
- baseline suficiente (30%): depende do tamanho da janela histórica
- completude (25%): proporção de semanas com dados
- baixo atraso (20%): atraso médio de notificação
- estabilidade histórica (15%): coeficiente de variação
- volume mínimo (10%): casos observados

## Limitações

- Dados sintéticos — não representam notificações reais
- Z-score assume distribuição aproximadamente normal
- Baseline limitado a 2–3 anos e com a limitação de inclusão do ano avaliado (MVP)
- Não considera fatores de confusão (vacinação, clima, mobilidade)
- Não substitui análise epidemiológica oficial
