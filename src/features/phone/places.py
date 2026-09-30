import os
import tempfile
from dataclasses import dataclass
from pathlib import Path

from controllers.types import Environments
from engine.color import identity
from engine.record import Record
from engine.sessions import Sessions
from engine.stored import read_json
from engine.viewer import known
from resources.base import SYSTEM

MAIN = "main"
TEMPORARY = tuple(dict.fromkeys(Path(folder).resolve() for folder in (tempfile.gettempdir(), "/tmp")))


@dataclass(frozen=True)
class Place:
    root: str
    project: str
    color: str
    environments: tuple[str, ...]
    running: bool
    working: tuple[str, ...]

    @classmethod
    def at(cls, root: Path, hub: Path) -> "Place":
        named = identity(root)
        rows = Environments(Record(root, MAIN), actor=SYSTEM).summaries()
        names = tuple(row["title"] for row in rows if not row["deleted"] and not row["completed"])
        sessions = Sessions(root)
        return cls(str(root), named["project"], named["color"], names, root == hub or running(root), tuple(name for name in names if sessions.holder(name)))

    def row(self, name: str) -> int:
        rows = Environments(Record(Path(self.root), MAIN), actor=SYSTEM).summaries()
        return next(row["n"] for row in rows if row["title"] == name and not row["deleted"] and not row["completed"])


def running(root: Path) -> bool:
    pid = read_json(root / "runtime" / "viewer.json", {}).get("pid")
    if not isinstance(pid, int):
        return False
    try:
        os.kill(pid, 0)
    except OSError:
        return False
    return True


def throwaway(root: Path) -> bool:
    return any(folder in root.parents for folder in TEMPORARY)


def places(hub: Path) -> list[Place]:
    here = hub.resolve()
    roots = dict.fromkeys([here, *(Path(j.root).resolve() for j in known())])
    return [Place.at(root, here) for root in roots if (root / "environments").is_dir() and (root == here or not throwaway(root))]
