from pathlib import Path

from features.sequences.shipped import ship
from migrations import shipped


def run(root: Path) -> str:
    return shipped(root, ship, "sequences")
