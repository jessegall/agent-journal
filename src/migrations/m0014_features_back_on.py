from pathlib import Path

from controllers.types import Features
from engine.record import Record
from resources.base import SYSTEM


def run(root: Path) -> str:
    switched = []
    for home in sorted(p for p in (Path(root) / "environments").glob("*") if p.is_dir()):
        rows = Features(Record(root, home.name), actor=SYSTEM)
        every = rows._every()
        marked = {int(r.updated) for r in every if r.data.get("missing")}
        for r in every:
            if r.data.get("enabled") or r.data.get("missing") or int(r.updated) not in marked:
                continue
            rows.update(r.n, enabled=True)
            switched.append(f"{home.name}:{r.title}")
    return f"switched back on: {', '.join(switched)}" if switched else "no feature was switched off by an upgrade"
