from pathlib import Path

from engine import runtime
from engine.record import Record
from features.templates.shipped import ship


def run(root: Path) -> str:
    made = ship(Record(Path(root), runtime.env(Path(root))))
    return f"templates shipped: {', '.join(made)}" if made else "the shipped templates are already there"
