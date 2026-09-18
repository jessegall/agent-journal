from v2.controllers.types import CONTROLLERS
from v2.features import on, trigger
from v2.resources.base import SYSTEM

FEATURE = "reminders"
DEFAULT = {"on": trigger.IDLE}


def repeat(event, record) -> None:
    agent = CONTROLLERS["agent"](record, actor=SYSTEM).load(event.n)
    if not trigger.due(record, agent, FEATURE, DEFAULT):
        return
    standing = [r for r in CONTROLLERS["reminder"](record, actor=SYSTEM).all() if not r.completed]
    trigger.fired(record, agent, FEATURE)
    if not standing:
        return
    lines = "; ".join(f"{r.n}. {r.title}" for r in standing)
    CONTROLLERS["nudge"](record, actor=SYSTEM).create(f"{len(standing)} reminder{'s' if len(standing) > 1 else ''} standing, read them", brief=lines, session=agent.title)


def register() -> None:
    on(FEATURE, "agent.updated", repeat)
