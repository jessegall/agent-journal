import json
import time

from resources.base import names
from resources.types import AgentRow
from engine.stored import write_json

PERCENT, USES, MINUTES, IDLE, WORKED, START = "percent", "uses", "minutes", "idle", "worked", "start"
UNITS = (PERCENT, USES, MINUTES, IDLE, WORKED, START)
TRIGGER = names("unit", "on", "every", "at")


def spec(record, name: str, default: dict) -> dict:
    return record.triggers.get(name, default)


def _file(record, session: str, name: str):
    return record.root / "runtime" / f"trigger-{session}-{name}.json"


def last(record, session: str, name: str) -> dict:
    try:
        return json.loads(_file(record, session, name).read_text())
    except (OSError, ValueError):
        return {}


def due(record, agent, name: str, default: dict) -> bool:
    s = spec(record, name, default)
    if not s:
        return False
    was = last(record, agent.title, name)
    observe(record, agent, name, was)
    unit, every = s.get(TRIGGER.unit) or s.get(TRIGGER.on), float(s.get(TRIGGER.every) or 1)
    context, uses, status, event = (float(was.get(AgentRow.context) or 0), int(was.get(AgentRow.uses) or 0), was.get(AgentRow.status), was.get(AgentRow.event))
    if unit == PERCENT and s.get(TRIGGER.at):
        return any(context < mark <= float(agent.context or 0) for mark in s[TRIGGER.at])
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
    write_json(_file(record, agent.title, name), {**last(record, agent.title, name), **fields})


def observe(record, agent, name: str, was: dict) -> None:
    if (was.get(AgentRow.status), was.get(AgentRow.event)) != (agent.status, agent.event):
        write(record, agent, name, status=agent.status, event=agent.event)


def fired(record, agent, name: str) -> None:
    write(record, agent, name, at=time.time(), context=agent.context or 0, uses=agent.uses or 0)
