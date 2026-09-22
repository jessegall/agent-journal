import time

from controllers.types import Agents, Nudges
from resources.base import AGENT, SYSTEM


def report(record, status, event, session="claude-1", **more):
    agents = Agents(record, actor=SYSTEM)
    row = agents.by_session(session)
    uses = int(row.data.get("uses") or 0) + (event == "PreToolUse")
    agents.saw(row.n, {"hook": event, "session": session, "cause": AGENT}, **{**row.data, "uses": uses, **more, "status": status, "event": event, "at": time.time()})


def tick(record, session="claude-1"):
    from engine.engine import emit_clock
    emit_clock(record, session)


def idle(record, **more):
    report(record, "working", "PreToolUse", **more)
    report(record, "idle", "Stop", **more)


def nudges(record):
    return [n.title for n in Nudges(record).all()]
