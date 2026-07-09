# Responsible Analytics — SentinelaSUS

## Propósito

SentinelaSUS é uma ferramenta de **demonstração e aprendizado**. Seu objetivo é ilustrar como séries temporais epidemiológicas podem ser analisadas com métodos estatísticos simples, transparência metodológica e comunicação responsável.

## O que este sistema NÃO faz

- Não detecta surtos reais
- Não substitui vigilância epidemiológica oficial (Sinan, Sivep-Gripe, etc.)
- Não faz diagnóstico clínico
- Não recomenda política pública
- Não prevê casos futuros
- Não usa dados reais de pacientes
- Não toma decisões automáticas

## Diferença entre sinal estatístico e diagnóstico

Um **sinal estatístico** indica que o número de casos observados em uma semana está acima do que seria esperado com base no histórico. Isso pode acontecer por:

- Variação aleatória
- Melhoria na notificação
- Mudança de critério diagnóstico
- Aumento real de incidência (que pode ou não caracterizar surto)

Apenas uma investigação epidemiológica de campo pode confirmar a natureza de um sinal.

## Linguagem responsável

**Usamos**: sinal estatístico, variação acima do esperado, baseline histórico, monitoramento exploratório, requer revisão técnica, não substitui análise oficial.

**Evitamos**: surto detectado, epidemia confirmada, município em crise, previsão de casos, recomendação médica, alarme oficial, decisão automática.

## Papel do analista humano

O SentinelaSUS é uma ferramenta de **apoio analítico**. As decisões sobre saúde pública devem ser tomadas por profissionais habilitados, considerando contexto local, dados complementares e avaliação de campo.

## Viés e limitações

- Dados sintéticos refletem as premissas do gerador, não a realidade
- Z-score é sensível a outliers e séries curtas
- Baseline não captura mudanças estruturais (epidemiológicas, demográficas, de notificação)
- Atraso de notificação pode mascarar sinais recentes

## Transparência

Todos os métodos, parâmetros e limitações estão documentados neste repositório. Nenhum algoritmo é caixa-preta.
