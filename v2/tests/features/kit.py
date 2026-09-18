import time

from v2.controllers.types import CONTROLLERS
from v2.resources.base import SYSTEM


def report(record, status, event, session="claude-1", **more):
    agents = CONTROLLERS["agent"](record, actor=SYSTEM)
    row = agents.by_session(session)
    agents.update(row.n, **{**row.data, **more, "status": status, "event": event, "at": time.time()})


def idle(record, **more):
    report(record, "working", "PreToolUse", **more)
    report(record, "idle", "Stop", **more)


def nudges(record):
    return [n.title for n in CONTROLLERS["nudge"](record).all()]
