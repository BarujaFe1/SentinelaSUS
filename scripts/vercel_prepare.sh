#!/usr/bin/env bash
set -euo pipefail
python -m pip install --upgrade pip
pip install -r requirements.txt
python scripts/generate_synthetic_epidata.py --seed 42
python scripts/run_pipeline.py
