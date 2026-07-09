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

`baseline_mean = média dos casos reportados na mesma semana em anos anteriores (janela ±2 semanas)`

`baseline_std = desvio padrão correspondente`

Exigência mínima: 3 observações na janela. Abaixo disso, o sinal é classificado como "não interpretável".

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

Usado como comparação metodológica.

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
- Baseline limitado a 2-3 anos
- Não considera fatores de confusão (vacinação, clima, mobilidade)
- Não substitui análise epidemiológica oficial
