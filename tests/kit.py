import time

from controllers.types import Agents, Nudges
from resources.base import AGENT, SYSTEM
from commands.cli import captured  # noqa: F401
from commands.cli import run  # noqa: F401
from commands.dispatch import dispatch  # noqa: F401
from commands.queries import asked_for  # noqa: F401
from commands.queries import asked_history  # noqa: F401
from commands.queries import asked_prompts  # noqa: F401
from commands.queries import asked_resume  # noqa: F401
from commands.queries import defaults  # noqa: F401
from commands.queries import ended  # noqa: F401
from features.plans.controller import Plans  # noqa: F401
from features.plugins.manifest import MANIFEST  # noqa: F401
from features.plugins.manifest import read  # noqa: F401
from features.tickets.controller import Tickets  # noqa: F401
from runner import engine as engine_module  # noqa: F401
from runner import engines  # noqa: F401
from runner.engine import Engine  # noqa: F401
from runner.hooks import PAUSED  # noqa: F401
from runner.hooks import answer  # noqa: F401
from runner.hooks import handle  # noqa: F401


def report(record, status, event, session="claude-1", **more):
    agents = Agents(record, actor=SYSTEM)
    row = agents.by_session(session)
    uses = int(row.data.get("uses") or 0) + (event == "PreToolUse")
    agents.saw(row.n, {"hook": event, "session": session, "cause": AGENT}, **{**row.data, "uses": uses, **more, "status": status, "event": event, "at": time.time()})


def tick(record, session="claude-1"):
    from runner.engine import emit_clock
    emit_clock(record, session)


def idle(record, **more):
    report(record, "working", "PreToolUse", **more)
    report(record, "idle", "Stop", **more)


def nudges(record):
    return [n.title for n in Nudges(record).all()]
