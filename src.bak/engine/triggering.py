"""What a trigger leaves on disk: the mark of when it last fired for a session, kept in memory beside the file and read again only when the file changes."""

import os
import time
from dataclasses import asdict, replace

from declaring.trigger import IDLE, MINUTE, MINUTES, NOTICES, PERCENT, START, USES, WORKED, Mark, Trigger
from engine import runtime
from engine.stored import read_promised_json, write_json
from resources.memo import Memo

HELD = Memo()


def saved(record, name: str, default: Trigger) -> Trigger:
    kept = record.triggers.get(name)
    return Trigger.from_json(kept) if isinstance(kept, dict) else default


def mark_file(record, session: str, name: str):
    return runtime.session_file(record.root, session, f"trigger-{name}.json")


def last(record, session: str, name: str) -> Mark:
    f = str(mark_file(record, session, name))
    stamp = stamped(f)
    return HELD.get(f, stamp, lambda: read_promised_json(f, Mark.from_json, Mark.from_json({})))


def held(f: str, mark: Mark) -> None:
    HELD.put(f, stamped(f), mark)


def stamped(f: str) -> int:
    try:
        return os.stat(f).st_mtime_ns
    except OSError:
        return 0


def due(record, agent, name: str, cadence: Trigger) -> bool:
    if not cadence:
        return False
    was = last(record, agent.title, name)
    observe(record, agent, name, was)
    unit, every = cadence.unit if cadence.unit else cadence.on, float(cadence.every) if cadence.every else 1.0
    context, uses, status, event = was.context, was.uses, was.status, was.event
    if unit == PERCENT and cadence.at:
        return any(context < mark <= float(agent.context) for mark in cadence.at)
    if unit == PERCENT:
        return int(float(agent.context) // every) > int(context // every)
    if unit == USES:
        return int(agent.uses) - uses >= every
    if unit == MINUTES:
        return time.time() - was.at >= every * MINUTE
    if unit == IDLE:
        return agent.status == IDLE and status != IDLE
    if unit == WORKED:
        return agent.status == IDLE and status != IDLE and int(agent.uses) > uses
    if unit == START:
        return agent.event == "SessionStart" and event != "SessionStart"
    if unit == NOTICES:
        return was.notices >= every
    return False


def claimed(record, agent, name: str, cadence: Trigger) -> bool:
    first = cadence.unit == USES and not last(record, agent.title, name).at
    if not first and not due(record, agent, name, cadence):
        return False
    fired(record, agent, name)
    return True


def write(record, agent, name: str, **fields) -> None:
    was = last(record, agent.title, name)
    now = replace(was, **fields)
    if now != was:
        f = str(mark_file(record, agent.title, name))
        write_json(f, asdict(now))
        held(f, now)


def observe(record, agent, name: str, was: Mark) -> None:
    if (was.status, was.event) != (agent.status, agent.event):
        held(str(mark_file(record, agent.title, name)), replace(was, status=agent.status, event=agent.event))


def fired(record, agent, name: str) -> None:
    write(record, agent, name, at=time.time(), context=agent.context, uses=agent.uses, notices=0)


def noticed(record, agent, name: str) -> None:
    write(record, agent, name, notices=last(record, agent.title, name).notices + 1)
