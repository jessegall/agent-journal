from pathlib import Path

from controllers.types import Features
from engine.record import Record
from engine.stored import read_json
from resources.base import SYSTEM


def run(root: Path) -> str:
    written = 0
    for home in sorted(p for p in (Path(root) / "environments").glob("*") if p.is_dir()):
        record = Record(root, home.name)
        rows = Features(record, actor=SYSTEM)
        for name, on in read_json(home / "settings.json", {}).get("features", {}).items():
            if "." in name or rows.named(name):
                continue
            rows.create(name, enabled=bool(on))
            written += 1
    return f"{written} feature rows written from the settings"
