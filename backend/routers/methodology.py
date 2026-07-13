from fastapi import APIRouter, Depends

from backend.config import (
    RELIABILITY_WEIGHTS,
    Z_THRESHOLD_ATENCAO,
    Z_THRESHOLD_OBSERVACAO,
    Z_THRESHOLD_SINAL_FORTE,
)
from backend.dependencies import DataStore, get_data_store

router = APIRouter()


@router.get("/methodology")
def get_methodology(store: DataStore = Depends(get_data_store)):
    return {
        "dataset": store.metadata,
        "methods": {
            "baseline": {
                "description": (
                    "Média e desvio dos reported_cases na mesma semana "
                    "epidemiológica ao longo dos anos disponíveis no dataset "
                    "(mínimo 3 observações para interpretação)."
                ),
                "min_sample_size": 3,
                "known_limitation": (
                    "A agregação atual inclui todos os anos da semana "
                    "(incluindo o ano avaliado). Adequado ao MVP sintético; "
                    "leave-one-out fica para evolução."
                ),
            },
            "z_score": {
                "description": (
                    "Z-score sazonal (mesma semana epidemiológica ao longo dos anos): "
                    "(observado - baseline_média) / max(baseline_desvio, 0.1). "
                    "Níveis oficiais do produto usam z assinado (não |z|)."
                ),
                "formula": "(x - mean_week) / max(std_week, 0.1)",
                "role": "classificador_oficial",
                "thresholds": {
                    "normal": f"z < {Z_THRESHOLD_OBSERVACAO}",
                    "observacao": f"{Z_THRESHOLD_OBSERVACAO} ≤ z < {Z_THRESHOLD_ATENCAO}",
                    "atencao": f"{Z_THRESHOLD_ATENCAO} ≤ z < {Z_THRESHOLD_SINAL_FORTE}",
                    "sinal_forte": f"z ≥ {Z_THRESHOLD_SINAL_FORTE}",
                },
            },
            "robust_score": {
                "description": (
                    "Score robusto com mediana e MAD (escala aproximada ao desvio-padrão "
                    "normal via fator 1.4826): "
                    "(observado - baseline_mediana) / max(MAD * 1.4826, 0.1). "
                    "Usado para comparação metodológica; não define o nível oficial sozinho."
                ),
                "formula": "(x - median_week) / max(MAD_week * 1.4826, 0.1)",
                "role": "comparador_robusto",
            },
            "reliability_score": {
                "description": "Score composto de confiabilidade do sinal (0-100)",
                "components": RELIABILITY_WEIGHTS,
                "interpretation": {
                    "confiavel": "80-100",
                    "moderado": "50-79",
                    "baixo": "30-49",
                    "nao_interpretavel": "0-29",
                },
            },
        },
        "alert_levels": {
            "normal": "Sem sinal estatístico relevante",
            "observacao": "Variação acima do esperado, baixa intensidade",
            "atencao": "Sinal estatístico moderado com dados suficientes",
            "sinal_forte": "Desvio elevado com boa confiabilidade",
            "nao_interpretavel": "Dados insuficientes para interpretar",
        },
        "limitations": [
            "Dados sintéticos para fins demonstrativos",
            "Z-score assume distribuição aproximadamente normal",
            "Não substitui análise epidemiológica oficial",
            "Não faz diagnóstico ou recomendação clínica",
            "Não detecta surtos reais",
            "Não cobre todo o território nacional",
        ],
    }
