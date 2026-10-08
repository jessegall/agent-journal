from pathlib import Path

from controllers.types import CONTROLLERS
from engine.record import Record
from resources.base import OWNER_ID, SYSTEM, USER, WRITER


def run(root: Path) -> str:
    named = sum(named_in(controller(record, actor=SYSTEM).rows) for record in Record.every(Path(root)) for controller in CONTROLLERS.values())
    return f"{named} rows a person made name the owner as the one who made them"


def named_in(rows) -> int:
    unnamed = [row for row in (rows.peek(summary["n"]) for summary in rows.summaries()) if row.author == USER and WRITER not in row.data]
    for row in unnamed:
        row.data[WRITER] = OWNER_ID
        rows.persist(row)
    return len(unnamed)
