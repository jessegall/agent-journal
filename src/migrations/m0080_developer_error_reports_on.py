from pathlib import Path

from controllers.types import Features, environment_records
from resources.base import SYSTEM


def run(root: Path) -> str:
    switched = 0
    for record in environment_records(Path(root)):
        rows = Features(record, actor=SYSTEM)
        row = next((r for r in rows.rows.every() if r.title == "dev_faults"), None)
        if row and not row.data.get("enabled"):
            rows.update(row.n, enabled=True)
            switched += 1
    return f"developer error reports and budget notices switched on in {switched} environments"
