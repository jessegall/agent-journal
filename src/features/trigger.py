import time
from dataclasses import dataclass

from resources.base import names
from resources.types import AgentRow
from engine.stored import read_json, write_json
from engine import runtime

PERCENT, USES, MINUTES, IDLE, WORKED, START = "percent", "uses", "minutes", "idle", "worked", "start"
UNITS = (PERCENT, USES, MINUTES, IDLE, WORKED, START)
HELD: dict[str, dict] = {}
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
        return cls(unit=str(spec.get(TRIGGER.unit) or ""), every=spec.get(TRIGGER.every) or 0, at=tuple(spec.get(TRIGGER.at) or ()),
                   on=str(spec.get(TRIGGER.on) or ""))


NEVER = Trigger()


def spec(record, name: str, default: Trigger) -> Trigger:
    saved = record.triggers.get(name)
    return Trigger.read(saved) if isinstance(saved, dict) else default


def _file(record, session: str, name: str):
    return runtime.session_file(record.root, session, f"trigger-{name}.json")


def last(record, session: str, name: str) -> dict:
    f = str(_file(record, session, name))
    if f not in HELD:
        HELD[f] = read_json(f, {})
    return dict(HELD[f])


def due(record, agent, name: str, default: Trigger) -> bool:
    s = spec(record, name, default)
    if not s:
        return False
    was = last(record, agent.title, name)
    observe(record, agent, name, was)
    unit, every = s.unit or s.on, float(s.every or 1)
    context, uses, status, event = (float(was.get(AgentRow.context) or 0), int(was.get(AgentRow.uses) or 0), was.get(AgentRow.status), was.get(AgentRow.event))
    if unit == PERCENT and s.at:
        return any(context < mark <= float(agent.context or 0) for mark in s.at)
    if unit == PERCENT:
        return int(float(agent.context or 0) // every) > int(context // every)
    if unit == USES:
        return int(agent.uses or 0) - uses >= every
    if unit == MINUTES:
        return time.time() - float(was.get(AgentRow.at) or 0) >= every * 60
    if unit == IDLE:
        return agent.status == IDLE and status != IDLE
    if unit == WORKED:
        return agent.status == IDLE and status != IDLE and int(agent.uses or 0) > uses
    if unit == START:
        return agent.event == "SessionStart" and event != "SessionStart"
    return False


def write(record, agent, name: str, **fields) -> None:
    was = last(record, agent.title, name)
    now = {**was, **fields}
    if now != was:
        HELD[str(_file(record, agent.title, name))] = now
        write_json(_file(record, agent.title, name), now)


def observe(record, agent, name: str, was: dict) -> None:
    if (was.get(AgentRow.status), was.get(AgentRow.event)) != (agent.status, agent.event):
        HELD[str(_file(record, agent.title, name))] = {**was, AgentRow.status: agent.status, AgentRow.event: agent.event}


def fired(record, agent, name: str) -> None:
    write(record, agent, name, at=time.time(), context=agent.context or 0, uses=agent.uses or 0)
