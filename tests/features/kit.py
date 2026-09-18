import time

from controllers.types import CONTROLLERS
from resources.base import SYSTEM


def report(record, status, event, session="claude-1", **more):
    agents = CONTROLLERS["agent"](record, actor=SYSTEM)
    row = agents.by_session(session)
    uses = int(row.data.get("uses") or 0) + (event == "PreToolUse")
    agents.update(row.n, **{**row.data, "uses": uses, **more, "status": status, "event": event, "at": time.time()})


def idle(record, **more):
    report(record, "working", "PreToolUse", **more)
    report(record, "idle", "Stop", **more)


def nudges(record):
    return [n.title for n in CONTROLLERS["nudge"](record).all()]
