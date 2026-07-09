from backend.schemas.alert import AlertSignal
from backend.schemas.brief import ReportBrief
from backend.schemas.condition import Condition
from backend.schemas.municipality import Municipality
from backend.schemas.observation import Observation
from backend.schemas.overview import OverviewKPIs
from backend.schemas.quality import DataQualityIssue


def test_municipality_schema():
    m = Municipality(
        municipality_id="abc", municipality_name="Teste", state="SF",
        population_band="medium", region_type="urban", synthetic_flag=True,
    )
    assert m.municipality_id == "abc"


def test_condition_schema():
    c = Condition(
        condition_id="c1", condition_name="Test", category="resp",
        seasonality_profile="uniform", base_rate_per_100k=50.0, notes="test",
    )
    assert c.base_rate_per_100k == 50.0


def test_observation_schema():
    from datetime import date
    o = Observation(
        observation_id="o1", municipality_id="m1", condition_id="c1",
        epidemiological_week=10, year=2025, week_start_date=date(2025, 3, 10),
        reported_cases=10, expected_cases=8.0, delayed_reports=1,
        completeness_score=0.9, source_type="simulated",
    )
    assert o.reported_cases == 10


def test_alert_schema():
    a = AlertSignal(
        signal_id="s1", municipality_id="m1", municipality_name="Mun",
        condition_id="c1", condition_name="Cond",
        epidemiological_week=10, year=2025,
        observed_cases=20, expected_cases=10.0,
        z_score=2.5, robust_score=None,
        alert_level="atencao", reliability_score=70,
        confidence_notes="Teste", data_quality_flags=[],
        explanation="Sinal acima do esperado",
    )
    assert a.alert_level == "atencao"


def test_quality_issue_schema():
    q = DataQualityIssue(
        issue_id="i1", municipality_id="m1", municipality_name="Mun",
        condition_id="c1", condition_name="Cond",
        week=10, year=2025, issue_type="missing_weeks",
        severity="high", affected_metric="reported_cases",
        explanation="Semana sem notificação",
    )
    assert q.severity == "high"


def test_brief_schema():
    b = ReportBrief(
        report_id="r1", generated_at="2025-01-01T00:00:00",
        selected_filters={}, main_findings=["Nada"],
        limitations=["Limitação"], recommended_next_checks=["Check"],
        disclaimer="Aviso",
    )
    assert "Nada" in b.main_findings


def test_overview_kpis_schema():
    k = OverviewKPIs(
        total_municipalities=10, total_conditions=3, total_weeks_analyzed=156,
        alert_counts={"normal": 100, "atencao": 5},
        non_interpretable_count=2, average_reliability=75.0,
        total_quality_issues=20,
    )
    assert k.total_municipalities == 10
