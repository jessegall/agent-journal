from pathlib import Path

from engine import runtime
from engine.record import Record
from features.templates.controller import Templates
from features.templates.shipped import RETIRED, ship
from resources.base import SYSTEM


def run(root: Path) -> str:
    record = Record(Path(root), runtime.env(Path(root)))
    templates = Templates(record, actor=SYSTEM)
    retired = [row["n"] for row in templates.summaries() if row["title"] in RETIRED and not row["completed"]]
    for n in retired:
        templates.complete(n, how="replaced by the Functional design doc template")
    made = ship(record)
    return f"plan templates replaced by the functional design doc: {len(retired)} retired, {', '.join(made) or 'nothing'} shipped"
