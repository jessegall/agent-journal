from pathlib import Path

from controllers.types import Features
from engine.record import Record
from resources.base import SYSTEM


def run(root: Path) -> str:
    switched = 0
    for home in sorted(p for p in (Path(root) / "environments").glob("*") if p.is_dir()):
        rows = Features(Record(root, home.name), actor=SYSTEM)
        row = next((r for r in rows._every() if r.title == "revisions"), None)
        if row and not row.data.get("enabled"):
            rows.update(row.n, enabled=True)
            switched += 1
    return f"revisions switched back on in {switched} environments"
