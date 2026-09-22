from pathlib import Path

from engine.record import Record
from features.dumps.controller import Dumps
from resources.base import USER


def run(root: Path) -> str:
    done = 0
    for folder in sorted((Path(root) / "environments").glob("*/dump")):
        dumps = Dumps(Record(Path(root), folder.parent.name), actor=USER)
        for row in dumps.summaries():
            dump = dumps.load(row["n"])
            if dump.completed and not dump.data.get("confirmed"):
                dumps.confirm(dump.n)
                done += 1
    return f"dumps filed before confirming existed: {done} confirmed"
