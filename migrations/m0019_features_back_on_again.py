from pathlib import Path

from migrations.m0014_features_back_on import run as switched_back


def run(root: Path) -> str:
    return switched_back(root)
