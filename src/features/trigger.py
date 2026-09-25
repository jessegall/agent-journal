import time
from dataclasses import asdict, dataclass, replace

from engine.fields import Loaded
from resources.base import names
from engine.stored import read_json, write_json
from engine import runtime

PERCENT, USES, MINUTES, IDLE, WORKED, START, NOTICES = "percent", "uses", "minutes", "idle", "worked", "start", "notices"
UNITS = (PERCENT, USES, MINUTES, IDLE, WORKED, START, NOTICES)
HELD: dict[str, "Mark"] = {}
TRIGGER = names("unit", "on", "every", "at")


@dataclass(frozen=True)
class Trigger(Loaded):
    unit: str = ""
    every: float = 0
    at: tuple = ()
    on: str = ""

    def __bool__(self) -> bool:
        return bool(self.unit or self.on)

    def spec(self) -> dict:
        return {key: list(value) if key == TRIGGER.at else value for key, value in
                ((TRIGGER.unit, self.unit), (TRIGGER.every, self.every), (TRIGGER.at, self.at), (TRIGGER.on, self.on)) if value}



@dataclass(frozen=True)
class Mark(Loaded):
    context: float = 0.0
    uses: int = 0
    status: str = ""
    event: str = ""
    at: float = 0.0
    count: int = 0
    edits: int = 0
    since: float = 0.0
    notified: bool | None = None
    notices: int = 0
    viewer_opened: bool = False


NEVER = Trigger()


def spec(record, name: str, default: Trigger) -> Trigger:
    saved = record.triggers.get(name)
    return Trigger.from_json(saved) if isinstance(saved, dict) else default


def _file(record, session: str, name: str):
    return runtime.session_file(record.root, session, f"trigger-{name}.json")


def last(record, session: str, name: str) -> Mark:
    f = str(_file(record, session, name))
    if f not in HELD:
        HELD[f] = Mark.from_json(read_json(f, {}))
    return HELD[f]


def due(record, agent, name: str, default: Trigger) -> bool:
    s = spec(record, name, default)
    if not s:
        return False
    was = last(record, agent.title, name)
    observe(record, agent, name, was)
    unit, every = s.unit if s.unit else s.on, float(s.every) if s.every else 1.0
    context, uses, status, event = was.context, was.uses, was.status, was.event
    if unit == PERCENT and s.at:
        return any(context < mark <= float(agent.context) for mark in s.at)
    if unit == PERCENT:
        return int(float(agent.context) // every) > int(context // every)
    if unit == USES:
        return int(agent.uses) - uses >= every
    if unit == MINUTES:
        return time.time() - was.at >= every * 60
    if unit == IDLE:
        return agent.status == IDLE and status != IDLE
    if unit == WORKED:
        return agent.status == IDLE and status != IDLE and int(agent.uses) > uses
    if unit == START:
        return agent.event == "SessionStart" and event != "SessionStart"
    if unit == NOTICES:
        return was.notices >= every
    return False


def write(record, agent, name: str, **fields) -> None:
    was = last(record, agent.title, name)
    now = replace(was, **fields)
    if now != was:
        HELD[str(_file(record, agent.title, name))] = now
        write_json(_file(record, agent.title, name), asdict(now))


def observe(record, agent, name: str, was: Mark) -> None:
    if (was.status, was.event) != (agent.status, agent.event):
        HELD[str(_file(record, agent.title, name))] = replace(was, status=agent.status, event=agent.event)


def fired(record, agent, name: str) -> None:
    write(record, agent, name, at=time.time(), context=agent.context, uses=agent.uses, notices=0)


def noticed(record, agent, name: str) -> None:
    write(record, agent, name, notices=last(record, agent.title, name).notices + 1)
