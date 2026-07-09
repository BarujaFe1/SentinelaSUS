from functools import lru_cache

from backend.config import GOLD_DIR, SYNTHETIC_DIR


class DataStore:
    def __init__(self):
        self.municipalities = []
        self.conditions = []
        self.observations = []
        self.alerts = []
        self.quality_issues = []
        self.metadata = {}
        self._loaded = False

    def load_all(self):
        if self._loaded:
            return
        self._load_municipalities()
        self._load_conditions()
        self._load_observations()
        self._load_alerts()
        self._load_quality_issues()
        self._load_metadata()
        self._loaded = True

    def _load_municipalities(self):
        import pandas as pd
        path = GOLD_DIR / "municipalities.parquet"
        if not path.exists():
            path = SYNTHETIC_DIR / "municipalities.csv"
        self.municipalities = (
            pd.read_csv(path).to_dict(orient="records")
            if path.suffix == ".csv"
            else pd.read_parquet(path).to_dict(orient="records")
        )

    def _load_conditions(self):
        import pandas as pd
        path = SYNTHETIC_DIR / "conditions.csv"
        self.conditions = pd.read_csv(path).to_dict(orient="records")

    def _load_observations(self):
        import pandas as pd
        path = GOLD_DIR / "observations_analytics.parquet"
        if not path.exists():
            path = SYNTHETIC_DIR / "weekly_observations.csv"
        self.observations = (
            pd.read_csv(path).to_dict(orient="records")
            if path.suffix == ".csv"
            else pd.read_parquet(path).to_dict(orient="records")
        )

    def _load_alerts(self):
        import pandas as pd
        path = GOLD_DIR / "alerts.parquet"
        if not path.exists():
            self.alerts = []
            return
        self.alerts = pd.read_parquet(path).to_dict(orient="records")

    def _load_quality_issues(self):
        import pandas as pd
        path = GOLD_DIR / "quality_issues.parquet"
        if not path.exists():
            path = SYNTHETIC_DIR / "data_quality_flags.csv"
        self.quality_issues = (
            pd.read_csv(path).to_dict(orient="records")
            if path.suffix == ".csv"
            else pd.read_parquet(path).to_dict(orient="records")
        )

    def _load_metadata(self):
        import json
        path = SYNTHETIC_DIR / "metadata.json"
        if path.exists():
            self.metadata = json.loads(path.read_text())


@lru_cache(maxsize=1)
def get_data_store() -> DataStore:
    store = DataStore()
    store.load_all()
    return store
