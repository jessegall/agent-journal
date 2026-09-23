from pathlib import Path

from controllers.types import Agents
from engine.record import Record
from engine.stored import write_text
from resources.base import SYSTEM


def run(root: Path) -> list[str]:
    renamed = []
    for home in sorted((Path(root) / "environments").glob("*/")):
        agents = Agents(Record(root, home.name), actor=SYSTEM)
        for row in agents.all(deleted=True):
            stopping = row.data.get("stopping") or {}
            if "what" not in stopping:
                continue
            row.data["stopping"] = {**{key: value for key, value in stopping.items() if key != "what"}, "description": stopping["what"]}
            write_text(agents.path(row.n), row.dump())
            renamed.append(row.ref)
    return renamed
