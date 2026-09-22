from pathlib import Path

from controllers.types import Questions
from engine.record import Record
from resources.base import SYSTEM


def run(root: Path) -> str:
    cleared = 0
    for home in sorted(p for p in (Path(root) / "environments").glob("*") if p.is_dir()):
        rows = Questions(Record(root, home.name), actor=SYSTEM)
        for r in rows._every():
            if r.completed and r.data.get("kept"):
                rows.stamp(r.n, kept=False)
                cleared += 1
    return f"{cleared} answered questions taken off the notifications panel"
