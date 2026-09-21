from controllers.types import Questions, Todos
from support.plans import held
from resources.base import SYSTEM
from resources.shapes import LEVELS


def open_rows(record) -> list:
    return Todos(record, actor=SYSTEM)._standing()


def asked(record, todo) -> bool:
    return any(todo.ref in q.refs for q in Questions(record, actor=SYSTEM)._standing())


def ready(record) -> list:
    todos = Todos(record, actor=SYSTEM)
    fit = [t for t in open_rows(record) if not t.blocked and not t.assigned and not todos.waits(t) and not asked(record, t) and not held(record, t)]
    return sorted(fit, key=lambda t: (-int(t.priority or LEVELS["default"]), t.n))


def next(record):
    rows = ready(record)
    return rows[0] if rows else None
