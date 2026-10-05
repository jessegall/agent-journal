import tempfile
from dataclasses import dataclass
from pathlib import Path
from typing import TypedDict

from controllers.types import CONTROLLERS, Agents, Environments, Works
from engine.color import identity
from engine.record import Record
from engine.sessions import Sessions, alive
from engine.viewer import known, last
from features.message_buttons.pressing import unspent
from features.plans.resource import READY
from features.status_bar.bar import current
from resources.base import SYSTEM, USER

MAIN = "main"
WAITED = ("question", "plan", "report", "doc")
TEMPORARY = tuple(dict.fromkeys(Path(folder).resolve() for folder in (tempfile.gettempdir(), "/tmp")))


class Detail(TypedDict):
    agent: str
    doing: str
    waiting: dict[str, int]
    inHand: int
    lastActive: float


def owed(row) -> bool:
    if row.type == "plan":
        return row.status == READY
    return row.type == "question" or USER not in row.seen or bool(unspent(row))


def detail(root: Path, name: str) -> Detail:
    record = Record(root, name)
    queue = current(record)["queue"]
    waiting = {kind: sum(map(owed, CONTROLLERS[kind](record, actor=SYSTEM).rows.standing())) for kind in WAITED}
    agents = Agents(record, actor=SYSTEM).rows.summaries()
    return Detail(agent=Agents(record, actor=SYSTEM).state(name), doing=queue[-1]["key"] if queue else "", waiting=waiting,
                  inHand=len(Works(record, actor=SYSTEM).rows.standing()), lastActive=max((row["updated"] for row in agents), default=0.0))


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
        return next(env.n for env in Environments(Record(Path(self.root), MAIN), actor=SYSTEM).rows.standing() if env.title == name and not env.helping)


def shown(root: Path) -> tuple[str, ...]:
    return tuple(env.title for env in Environments(Record(root, MAIN), actor=SYSTEM).rows.standing() if not env.owner)


def running(root: Path) -> bool:
    return alive(last(root).pid)


def throwaway(root: Path) -> bool:
    return any(folder in root.parents for folder in TEMPORARY)


def places(hub: Path) -> list[Place]:
    here = hub.resolve()
    roots = dict.fromkeys([here, *(Path(j.root).resolve() for j in known())])
    return [Place.at(root, here) for root in roots if (root / "environments").is_dir() and (root == here or not throwaway(root))]
