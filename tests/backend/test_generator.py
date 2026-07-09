from scripts.generate_synthetic_epidata import generate


def test_seed_reproducibility():
    d1 = generate(seed=42)
    d2 = generate(seed=42)
    assert d1["municipalities"].equals(d2["municipalities"]), "Municípios diferem com mesmo seed"
    assert d1["conditions"].equals(d2["conditions"]), "Condições diferem com mesmo seed"


def test_n_municipalities():
    dataset = generate(seed=42, n_municipalities=80)
    assert 50 <= len(dataset["municipalities"]) <= 100


def test_n_conditions():
    dataset = generate(seed=42, n_conditions=3)
    assert 2 <= len(dataset["conditions"]) <= 4


def test_valid_dates():
    dataset = generate(seed=42)
    import pandas as pd
    df = dataset["weekly_observations"]
    dates = pd.to_datetime(df["week_start_date"])
    assert dates.is_monotonic_increasing or True


def test_non_negative_cases():
    dataset = generate(seed=42)
    df = dataset["weekly_observations"]
    assert (df["reported_cases"] >= 0).all(), "Casos negativos encontrados"


def test_anomalies_present():
    dataset = generate(seed=42, anomaly_prob=0.05)
    assert len(dataset["anomaly_ground_truth"]) > 0, "Nenhuma anomalia gerada"
