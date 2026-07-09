# Premissas — SentinelaSUS

## Premissas do modelo

1. Séries são semanais e agregadas por município
2. Sazonalidade anual é o principal padrão temporal
3. Baseline de anos anteriores é representativo do comportamento esperado
4. Dados ausentes são ignorados (não imputados)
5. Z-score assume distribuição aproximadamente normal dos resíduos
6. Atraso de notificação é homogêneo dentro de cada município
7. População municipal é estável no período analisado
8. Subnotificação afeta todas as semanas igualmente

## Premissas éticas

1. Dados sintéticos não representam indivíduos, pacientes ou notificações reais
2. Alertas são sinais estatísticos, não diagnósticos
3. O sistema não substitui vigilância epidemiológica oficial
4. Qualquer uso real requer validação por autoridade sanitária
5. Métricas de confiabilidade são aproximações conceituais

## Premissas de implementação

1. Pipeline executa em memória (dataset cabe em RAM)
2. API é stateless (dados carregados no startup)
3. Frontend consome API via fetch
4. Seed reproduzível para todos os componentes
