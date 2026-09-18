from v2.controllers.types import CONTROLLERS
from v2.features import on, trigger
from v2.resources.base import SYSTEM

FEATURE = "work"
DEFAULT = {"on": trigger.IDLE}


def started(event, record) -> None:
    works = CONTROLLERS["work"](record, actor=SYSTEM)
    n = works.load(event.n).data.get("todo")
    if not n:
        return
    todos = CONTROLLERS["todo"](record, actor=SYSTEM)
    todo = todos.load(int(n))
    works.link(event.n, todo.ref)
    todos.update(todo.n, status="started", work=event.n)


def ended(event, record) -> None:
    work = CONTROLLERS["work"](record, actor=SYSTEM).load(event.n)
    n = work.data.get("todo")
    if not n or not event.data.get("todo"):
        return
    todos = CONTROLLERS["todo"](record, actor=SYSTEM)
    if not todos.load(int(n)).completed:
        todos.complete(int(n), how=f"work {work.n} ended")


def remind(event, record) -> None:
    agent = CONTROLLERS["agent"](record, actor=SYSTEM).load(event.n)
    if not trigger.due(record, agent, FEATURE, DEFAULT):
        return
    trigger.fired(record, agent, FEATURE)
    for w in CONTROLLERS["work"](record, actor=SYSTEM).all():
        if not w.completed:
            CONTROLLERS["nudge"](record, actor=SYSTEM).create(f"work {w.n} open", session=agent.title)
            return


def register() -> None:
    on(FEATURE, "work.created", started)
    on(FEATURE, "work.completed", ended)
    on(FEATURE, "agent.updated", remind)
