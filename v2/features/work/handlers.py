from v2.controllers.types import CONTROLLERS
from v2.features import on
from v2.resources.base import SYSTEM

FEATURE = "work"


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


def register() -> None:
    on(FEATURE, "work.created", started)
    on(FEATURE, "work.completed", ended)
