import os
from dataclasses import dataclass
from pathlib import Path

from controllers.types import Environments
from engine.color import identity
from engine.record import Record
from engine.stored import read_json
from engine.viewer import known
from resources.base import SYSTEM

MAIN = "main"


@dataclass(frozen=True)
class Place:
    root: str
    project: str
    color: str
    environments: tuple[str, ...]

    @classmethod
    def at(cls, root: Path) -> "Place":
        named = identity(root)
        rows = Environments(Record(root, MAIN), actor=SYSTEM).summaries()
        return cls(str(root), named["project"], named["color"], tuple(row["title"] for row in rows if not row["deleted"] and not row["completed"]))


def running(root: Path) -> bool:
    pid = read_json(root / "runtime" / "viewer.json", {}).get("pid")
    if not isinstance(pid, int):
        return False
    try:
        os.kill(pid, 0)
    except OSError:
        return False
    return True


def places(hub: Path) -> list[Place]:
    roots = dict.fromkeys([hub.resolve(), *(Path(j.root).resolve() for j in known())])
    return [Place.at(root) for root in roots if (root / "environments").is_dir() and (root == hub.resolve() or running(root))]
