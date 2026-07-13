from datetime import datetime, timezone
from uuid import uuid4

from backend.config import PROHIBITED_TERMS
from backend.schemas.brief import ReportBrief


def generate_brief(
    store,
    municipality_id: str | None = None,
    condition_id: str | None = None,
) -> ReportBrief:
    filters = {}
    if municipality_id:
        filters["municipality_id"] = municipality_id
    if condition_id:
        filters["condition_id"] = condition_id

    alerts = store.alerts
    if municipality_id:
        alerts = [a for a in alerts if a.get("municipality_id") == municipality_id]
    if condition_id:
        alerts = [a for a in alerts if a.get("condition_id") == condition_id]

    strong = [a for a in alerts if a.get("alert_level") == "sinal_forte"]
    attention = [a for a in alerts if a.get("alert_level") == "atencao"]
    observation = [a for a in alerts if a.get("alert_level") == "observacao"]
    non_interp = [a for a in alerts if a.get("alert_level") == "nao_interpretavel"]
    low_reliability = [a for a in alerts if (a.get("reliability_score") or 0) < 50]

    findings = []
    if strong:
        findings.append(
            f"{len(strong)} sinais fortes detectados em municípios com dados suficientes."
        )
    if attention:
        findings.append(f"{len(attention)} sinais de atenção requerem revisão técnica.")
    if observation:
        findings.append(
            f"{len(observation)} sinais em observação, sem intensidade crítica no momento."
        )
    if non_interp:
        findings.append(f"{len(non_interp)} registros não interpretáveis por dados insuficientes.")
    if low_reliability:
        findings.append(
            f"{len(low_reliability)} alertas com baixa confiabilidade (< 50) — "
            "revisar qualidade dos dados antes de interpretar."
        )
    if not findings:
        findings.append("Nenhum sinal estatístico incomum detectado no recorte analisado.")

    limitations = [
        "Dados sintéticos para fins demonstrativos.",
        "Z-score assume distribuição aproximadamente normal dos dados históricos.",
        "Baseline histórico limitado a 2-3 anos de dados sintéticos.",
        "Não substitui análise epidemiológica oficial realizada por autoridade sanitária.",
        "Não detecta eventos reais de relevância epidemiológica — "
        "apenas sinais estatísticos em dados sintéticos.",
        "Não faz diagnóstico, recomendação clínica ou projeção de casos futuros.",
    ]

    recommendations = []
    if strong:
        recommendations.append(
            "Revisar municípios com sinal forte: verificar consistência dos dados e contexto local."
        )
    if attention:
        recommendations.append("Acompanhar evolução dos sinais de atenção nas próximas semanas.")
    if non_interp:
        recommendations.append(
            "Investigar municípios com dados insuficientes para melhorar a completude das séries."
        )
    if low_reliability:
        recommendations.append(
            "Priorizar melhoria de qualidade dos dados em municípios com baixa confiabilidade."
        )
    recommendations.append(
        "Comparar achados com outras fontes de informação "
        "disponíveis localmente."
    )

    disclaimer = (
        "Este relatório é gerado automaticamente a partir de dados sintéticos "
        "para fins demonstrativos. "
        "Não constitui diagnóstico, alerta oficial ou recomendação de política pública. "
        "Qualquer decisão baseada nestas informações deve ser precedida de análise técnica "
        "por profissional de saúde ou vigilância epidemiológica habilitado."
    )

    brief_text = (
        " ".join(findings)
        + " "
        + " ".join(limitations)
        + " "
        + " ".join(recommendations)
        + " "
        + disclaimer
    )
    found = [term for term in PROHIBITED_TERMS if term in brief_text.lower()]
    if found:
        raise ValueError(f"Termos proibidos encontrados no brief: {found}")

    return ReportBrief(
        report_id=str(uuid4()),
        generated_at=datetime.now(timezone.utc),
        selected_filters=filters,
        main_findings=findings,
        limitations=limitations,
        recommended_next_checks=recommendations,
        disclaimer=disclaimer,
    )
