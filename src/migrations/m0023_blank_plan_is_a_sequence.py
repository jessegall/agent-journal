from pathlib import Path

from engine import runtime
from engine.record import Record
from features.sequences.shipped import ship
from migrations.m0021_functional_design_is_a_doc import run as retire_templates


def run(root: Path) -> str:
    made = ship(Record(Path(root), runtime.env(Path(root))))
    return f"{retire_templates(root)}; sequences shipped: {', '.join(made) or 'nothing'}"
