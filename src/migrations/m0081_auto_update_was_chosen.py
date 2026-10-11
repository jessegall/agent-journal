from pathlib import Path

from controllers.types import Features, environment_records
from resources.base import SYSTEM


def run(root: Path) -> str:
    """Records automatic updates as a choice in every environment that has none, before the default turns off for new journals."""
    kept = 0
    for record in environment_records(Path(root)):
        rows = Features(record, actor=SYSTEM)
        if any(r.title == "auto_update" for r in rows.rows.every()):
            continue
        rows.create("auto_update", enabled=True)
        kept += 1
    return f"automatic updates kept on in {kept} environments that had never chosen"
