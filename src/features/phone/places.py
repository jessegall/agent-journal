import os
import tempfile
from dataclasses import dataclass
from pathlib import Path
from typing import TypedDict

from controllers.types import CONTROLLERS, Agents, Environments, Works
from engine.color import identity
from engine.record import Record
from engine.sessions import Sessions
from engine.stored import read_json
from engine.viewer import known
from features.status_bar.bar import current
from resources.base import SYSTEM, USER
from resources.types import BUSY, WORKING

MAIN = "main"
OFFLINE, IDLE_STATE, WORKING_STATE = "offline", "idle", "working"
WAITED = ("question", "plan", "report", "doc")
TEMPORARY = tuple(dict.fromkeys(Path(folder).resolve() for folder in (tempfile.gettempdir(), "/tmp")))


class Detail(TypedDict):
    agent: str
    doing: str
    waiting: dict[str, int]
    inHand: int
    lastActive: float


def agent_state(record: Record, name: str) -> str:
    holder = Sessions(record.root).holder(name)
    if not holder:
        return OFFLINE
    row = Agents(record, actor=SYSTEM)._titled(holder)
    return WORKING_STATE if row is not None and row.data.get("status") in (BUSY, WORKING) else IDLE_STATE


def owed(row) -> bool:
    if row.type == "plan":
        return row.status == "ready"
    return row.type == "question" or USER not in row.seen


def detail(root: Path, name: str) -> Detail:
    record = Record(root, name)
    queue = current(record)["queue"]
    waiting = {kind: sum(map(owed, CONTROLLERS[kind](record, actor=SYSTEM)._standing())) for kind in WAITED}
    agents = Agents(record, actor=SYSTEM).summaries()
    return Detail(agent=agent_state(record, name), doing=queue[-1]["key"] if queue else "", waiting=waiting,
                  inHand=len(Works(record, actor=SYSTEM)._standing()), lastActive=max((row["updated"] for row in agents), default=0.0))


@dataclass(frozen=True)
class Place:
    root: str
    project: str
    color: str
    environments: tuple[str, ...]
    running: bool
    working: tuple[str, ...]
    details: dict[str, Detail]

    @classmethod
    def at(cls, root: Path, hub: Path) -> "Place":
        named = identity(root)
        names = shown(root)
        sessions = Sessions(root)
        return cls(str(root), named["project"], named["color"], names, root == hub or running(root), tuple(name for name in names if sessions.holder(name)),
                   {name: detail(root, name) for name in names})

    def row(self, name: str) -> int:
        return next(env.n for env in Environments(Record(Path(self.root), MAIN), actor=SYSTEM)._standing() if env.title == name and not env.helping)


def shown(root: Path) -> tuple[str, ...]:
    return tuple(env.title for env in Environments(Record(root, MAIN), actor=SYSTEM)._standing() if not env.helping)


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
