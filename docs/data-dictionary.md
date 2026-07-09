# Dicionário de Dados — SentinelaSUS

## municipalities.csv

| Campo | Tipo | Descrição |
|---|---|---|
| municipality_id | string (UUID) | Identificador único do município |
| municipality_name | string | Nome fictício |
| state | string | UF (fictícia) |
| population_band | string | "small", "medium", "large" |
| region_type | string | "urban", "rural", "mixed" |
| synthetic_flag | boolean | Sempre true |
| population | integer | População simulada |

## conditions.csv

| Campo | Tipo | Descrição |
|---|---|---|
| condition_id | string (UUID) | Identificador único da condição |
| condition_name | string | Nome descritivo |
| category | string | Categoria epidemiológica |
| seasonality_profile | string | "winter_peak", "summer_peak", "uniform" |
| base_rate_per_100k | float | Taxa base para geração |
| notes | string | Aviso de dado sintético |

## weekly_observations.csv

| Campo | Tipo | Descrição |
|---|---|---|
| observation_id | string (UUID) | Identificador único |
| municipality_id | string (UUID) | FK para municipalities |
| condition_id | string (UUID) | FK para conditions |
| epidemiological_week | integer | 1 a 52 |
| year | integer | 2024-2026 |
| week_start_date | date | Segunda-feira da semana |
| reported_cases | integer | Casos reportados (>= 0) |
| delayed_reports | integer | Atraso simulado |
| completeness_score | float | 0.0 a 1.0 |
| source_type | string | "simulated" |
| synthetic_generation_seed | integer | Seed de geração |

## anomaly_ground_truth.csv

| Campo | Tipo | Descrição |
|---|---|---|
| municipality_id | string | FK |
| condition_id | string | FK |
| year | integer | |
| epidemiological_week | integer | |
| observed_cases | integer | Casos com anomalia |
| expected_cases | float | Casos esperados sem anomalia |
| anomaly_type | string | "pontual" ou "sustentada" |
| generation_seed | integer | Seed de geração |

## data_quality_flags.csv

| Campo | Tipo | Descrição |
|---|---|---|
| municipality_id | string | FK |
| condition_id | string | FK |
| week | integer | |
| year | integer | |
| issue_type | string | Tipo do problema |
| severity | string | "low", "medium", "high" |
| affected_metric | string | Métrica afetada |
| explanation | string | Descrição |
