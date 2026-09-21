from controllers.types import Questions, Todos, Works
from features.plans.progress import held
from resources.base import SYSTEM
from resources.shapes import LEVELS


def open_rows(record) -> list:
    return Todos(record, actor=SYSTEM)._standing()


def asked(record, todo) -> bool:
    return any(todo.ref in q.refs for q in Questions(record, actor=SYSTEM)._standing())


def worked(record) -> set:
    return {int(w.todo) for w in Works(record, actor=SYSTEM)._standing() if w.todo}


def ready(record) -> list:
    todos, taken = Todos(record, actor=SYSTEM), worked(record)
    fit = [t for t in open_rows(record) if not t.blocked and not t.assigned and t.n not in taken and not todos.waits(t) and not asked(record, t) and not held(record, t)]
    return sorted(fit, key=lambda t: (-int(t.priority or LEVELS["default"]), t.n))


def next(record):
    rows = ready(record)
    return rows[0] if rows else None
