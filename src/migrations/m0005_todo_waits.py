from pathlib import Path

from controllers.types import Todos
from engine.record import Record
from resources.base import SYSTEM
from engine.stored import write_text


def run(root: Path) -> list[str]:
    moved = []
    for home in sorted((Path(root) / "environments").glob("*/")):
        todos = Todos(Record(root, home.name), actor=SYSTEM)
        for row in todos.all(deleted=True):
            waits = [ref for ref in row.refs if ref.startswith("todo:")]
            if not waits:
                continue
            row.refs = [ref for ref in row.refs if ref not in waits]
            row.data["after"] = list(dict.fromkeys([*(row.after or []), *waits]))
            write_text(todos.path(row.n), row.dump())
            moved.append(row.ref)
    return moved
