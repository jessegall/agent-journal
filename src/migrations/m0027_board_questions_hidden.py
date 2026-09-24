from pathlib import Path

from controllers.types import Questions
from engine.record import Record
from resources.base import SYSTEM


def run(root: Path) -> list[str]:
    hidden = []
    for home in sorted((Path(root) / "environments").glob("*/")):
        questions = Questions(Record(root, home.name), actor=SYSTEM)
        for row in questions.all(deleted=True):
            if row.hidden or not any(ref.startswith("board:") for ref in row.refs):
                continue
            questions.update(row.n, hidden=True)
            hidden.append(row.ref)
    return hidden
