import time
from dataclasses import asdict, dataclass, replace

from engine.fields import list_of, number_of, text_of
from resources.base import names
from resources.types import AgentRow
from engine.stored import read_json, write_json
from engine import runtime

PERCENT, USES, MINUTES, IDLE, WORKED, START = "percent", "uses", "minutes", "idle", "worked", "start"
UNITS = (PERCENT, USES, MINUTES, IDLE, WORKED, START)
HELD: dict[str, "Mark"] = {}
TRIGGER = names("unit", "on", "every", "at")


@dataclass(frozen=True)
class Trigger:
    unit: str = ""
    every: float = 0
    at: tuple = ()
    on: str = ""

    def __bool__(self) -> bool:
        return bool(self.unit or self.on)

    def spec(self) -> dict:
        return {key: list(value) if key == TRIGGER.at else value for key, value in
                ((TRIGGER.unit, self.unit), (TRIGGER.every, self.every), (TRIGGER.at, self.at), (TRIGGER.on, self.on)) if value}

    @classmethod
    def read(cls, spec: dict) -> "Trigger":
        return cls(unit=text_of(spec, TRIGGER.unit), every=number_of(spec, TRIGGER.every), at=tuple(list_of(spec, TRIGGER.at)), on=text_of(spec, TRIGGER.on))


@dataclass(frozen=True)
class Mark:
    context: float = 0.0
    uses: int = 0
    status: str = ""
    event: str = ""
    at: float = 0.0
    count: int = 0
    edits: int = 0
    since: float = 0.0
    notified: bool | None = None
    viewer_opened: bool = False

    @classmethod
    def from_json(cls, raw) -> "Mark":
        raw = raw if isinstance(raw, dict) else {}
        return cls(context=number_of(raw, AgentRow.context), uses=int(number_of(raw, AgentRow.uses)), status=text_of(raw, AgentRow.status),
                   event=text_of(raw, AgentRow.event), at=number_of(raw, AgentRow.at), count=int(number_of(raw, "count")),
                   edits=int(number_of(raw, "edits")), since=number_of(raw, "since"), notified=raw.get("notified"),
                   viewer_opened=bool(raw.get("viewer_opened")))


NEVER = Trigger()


def spec(record, name: str, default: Trigger) -> Trigger:
    saved = record.triggers.get(name)
    return Trigger.read(saved) if isinstance(saved, dict) else default


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
    write(record, agent, name, at=time.time(), context=agent.context, uses=agent.uses)
