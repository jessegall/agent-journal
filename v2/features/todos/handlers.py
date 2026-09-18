from v2.controllers.types import CONTROLLERS
from v2.features import on, trigger
from v2.features.todos.next import next
from v2.resources.base import SYSTEM

FEATURE = "todos"
DEFAULT = {"on": trigger.IDLE}


def offer(event, record) -> None:
    agent = CONTROLLERS["agent"](record, actor=SYSTEM).load(event.n)
    if not trigger.due(record, agent, FEATURE, DEFAULT):
        return
    trigger.fired(record, agent, FEATURE)
    if not record.setting("auto", False):
        return
    if any(not w.completed for w in CONTROLLERS["work"](record, actor=SYSTEM).all()):
        return
    row = next(record)
    if row:
        CONTROLLERS["nudge"](record, actor=SYSTEM).create(f"todo {row.n} next", session=agent.title)


def register() -> None:
    on(FEATURE, "agent.updated", offer)
