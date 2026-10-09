from pathlib import Path

from controllers.types import environment_records
from features.helpers.controller import give_back, left_behind


def run(root: Path) -> list[str]:
    """Gives back every open to-do still assigned to a helper that has finished, so it can be handed or worked again."""
    lines = []
    for record in environment_records(Path(root)):
        rows = left_behind(record)
        give_back(record, rows)
        lines += [f"to-do {row.n} in {record.env} is given back from {row.assigned}, which had finished" for row in rows]
    return lines
