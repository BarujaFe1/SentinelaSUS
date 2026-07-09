
from backend.config import PROHIBITED_TERMS
from backend.pipeline.brief_generator import generate_brief


def _check_prohibited_terms(text: str) -> list[str]:
    found = []
    for term in PROHIBITED_TERMS:
        if term.lower() in text.lower():
            found.append(term)
    return found


class MockDataStore:
    def __init__(self):
        self.alerts = []
        self.municipalities = []
        self.conditions = []
        self.observations = []
        self.quality_issues = []


def test_brief_no_prohibited_terms():
    store = MockDataStore()
    brief = generate_brief(store)
    brief_text = (
        " ".join(brief.main_findings)
        + " "
        + " ".join(brief.limitations)
        + " "
        + brief.disclaimer
    )
    found = _check_prohibited_terms(brief_text)
    assert len(found) == 0, f"Termos proibidos encontrados no brief: {found}"


def test_brief_with_alerts_no_prohibited_terms():
    store = MockDataStore()
    store.alerts = [
        {
            "signal_id": "s1", "municipality_id": "m1", "municipality_name": "Mun",
            "condition_id": "c1", "condition_name": "Cond",
            "epidemiological_week": 10, "year": 2025,
            "observed_cases": 50, "expected_cases": 10.0,
            "z_score": 4.0, "robust_score": None,
            "alert_level": "sinal_forte", "reliability_score": 80,
            "confidence_notes": "Teste", "data_quality_flags": [],
            "explanation": "Sinal forte detectado",
        }
    ]
    brief = generate_brief(store)
    brief_text = (
        " ".join(brief.main_findings)
        + " "
        + " ".join(brief.limitations)
        + " "
        + brief.disclaimer
    )
    found = _check_prohibited_terms(brief_text)
    assert len(found) == 0, (
        f"Termos proibidos encontrados no brief com alertas: {found}"
    )
