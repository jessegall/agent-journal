from pathlib import Path

from features.templates.shipped import ship
from migrations import shipped


def run(root: Path) -> str:
    return shipped(root, ship, "templates")
