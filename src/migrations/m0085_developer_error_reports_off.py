from pathlib import Path

from controllers.types import Features, environment_records
from resources.base import SYSTEM

DEVELOPER = ("dev_faults", "session_recording", "critique")


def run(root: Path) -> str:
    """Switches the Developer group off wherever m0080 or an earlier default left it on. The defaults changed in 2.272.3, but a feature whose switch was already written keeps the value it was given, so nothing in the Developer group goes quiet until it is written off."""
    switched = 0
    for record in environment_records(Path(root)):
        rows = Features(record, actor=SYSTEM)
        for row in [r for r in rows.rows.every() if r.title in DEVELOPER and r.data.get("enabled")]:
            rows.update(row.n, enabled=False)
            switched += 1
    return f"the Developer group switched off in {switched} places"
