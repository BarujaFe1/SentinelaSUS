from fastapi.testclient import TestClient

from backend.main import app

client = TestClient(app)

EXPECTED_ALERT_FIELDS = {
    "signal_id",
    "municipality_id",
    "municipality_name",
    "condition_id",
    "condition_name",
    "epidemiological_week",
    "year",
    "observed_cases",
    "expected_cases",
    "z_score",
    "robust_score",
    "alert_level",
    "reliability_score",
    "confidence_notes",
    "data_quality_flags",
    "explanation",
}

EXPECTED_OBSERVATION_FIELDS = {
    "observation_id",
    "municipality_id",
    "condition_id",
    "epidemiological_week",
    "year",
    "week_start_date",
    "reported_cases",
    "expected_cases",
    "delayed_reports",
    "completeness_score",
    "source_type",
    "z_score",
    "robust_score",
    "alert_level",
    "reliability_score",
    "baseline_mean",
    "baseline_std",
    "baseline_median",
    "baseline_mad",
}

EXPECTED_QUALITY_FIELDS = {
    "issue_id",
    "municipality_id",
    "municipality_name",
    "condition_id",
    "condition_name",
    "week",
    "year",
    "issue_type",
    "severity",
    "affected_metric",
    "explanation",
}


def test_health():
    assert client.get("/health").status_code == 200


def test_metadata():
    r = client.get("/api/v1/demo/metadata")
    assert r.status_code == 200
    assert r.json()["n_municipalities"] == 80


def test_overview():
    r = client.get("/api/v1/overview")
    assert r.status_code == 200
    body = r.json()
    assert body["total_municipalities"] == 80
    assert body["total_conditions"] == 3
    assert "alert_counts" in body


def test_municipalities():
    r = client.get("/api/v1/municipalities")
    assert r.status_code == 200
    assert len(r.json()) == 80


def test_conditions():
    r = client.get("/api/v1/conditions")
    assert r.status_code == 200
    body = r.json()
    assert len(body) == 3
    assert all("condition_id" in c and "condition_name" in c for c in body)


def test_timeseries_schema():
    r = client.get("/api/v1/timeseries?municipality_id=&condition_id=")
    assert r.status_code == 200
    body = r.json()
    assert len(body) > 0
    assert EXPECTED_OBSERVATION_FIELDS.issubset(body[0].keys())


def test_timeseries_filtered():
    muns = client.get("/api/v1/municipalities").json()
    mid = muns[0]["municipality_id"]
    r = client.get(f"/api/v1/timeseries?municipality_id={mid}")
    assert r.status_code == 200
    body = r.json()
    assert len(body) > 0
    assert all(o["municipality_id"] == mid for o in body)


def test_alerts_schema_and_paging():
    r = client.get("/api/v1/alerts")
    assert r.status_code == 200
    body = r.json()
    assert len(body) <= 50
    assert EXPECTED_ALERT_FIELDS.issubset(body[0].keys())


def test_alerts_filters():
    r = client.get("/api/v1/alerts?alert_level=sinal_forte")
    assert r.status_code == 200
    assert all(a["alert_level"] == "sinal_forte" for a in r.json())

    r = client.get("/api/v1/alerts?min_reliability=50")
    assert r.status_code == 200
    assert all(a["reliability_score"] >= 50 for a in r.json())


def test_alert_detail():
    alerts = client.get("/api/v1/alerts").json()
    aid = alerts[0]["signal_id"]
    r = client.get(f"/api/v1/alerts/{aid}")
    assert r.status_code == 200
    assert r.json()["signal_id"] == aid


def test_alert_detail_not_found():
    r = client.get("/api/v1/alerts/does-not-exist")
    assert r.status_code == 404


def test_quality_issues_schema():
    r = client.get("/api/v1/quality/issues")
    assert r.status_code == 200
    body = r.json()
    assert len(body) > 0
    assert EXPECTED_QUALITY_FIELDS.issubset(body[0].keys())


def test_quality_issues_filters():
    r = client.get("/api/v1/quality/issues?severity=high")
    assert r.status_code == 200
    assert all(q["severity"] == "high" for q in r.json())


def test_brief():
    r = client.get("/api/v1/brief")
    assert r.status_code == 200
    body = r.json()
    assert "main_findings" in body
    assert "disclaimer" in body


def test_methodology():
    r = client.get("/api/v1/methodology")
    assert r.status_code == 200
    body = r.json()
    assert "methods" in body and "alert_levels" in body
    assert "rolling" not in body["methods"]["z_score"]["description"].lower()
    assert "formula" in body["methods"]["z_score"]
    assert "formula" in body["methods"]["robust_score"]


def test_false_alert_evaluation_endpoint():
    r = client.get("/api/v1/evaluation/false-alerts")
    assert r.status_code == 200
    body = r.json()
    assert "z_score_method" in body and "mad_method" in body
    assert body["summary"]["planted_anomalies"] > 0
    assert body["z_score_method"]["tp"] + body["z_score_method"]["fn"] == body["summary"][
        "planted_anomalies"
    ]
    assert "disclaimer" in body


def test_municipality_summary():
    muns = client.get("/api/v1/municipalities").json()
    mid = muns[0]["municipality_id"]
    r = client.get(f"/api/v1/municipalities/{mid}/summary")
    assert r.status_code == 200
    body = r.json()
    assert body["municipality"]["municipality_id"] == mid
    assert body["total_conditions"] == 3


def test_municipality_summary_not_found():
    r = client.get("/api/v1/municipalities/does-not-exist/summary")
    assert r.status_code == 404
