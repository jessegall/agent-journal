from controllers.types import Questions, Todos, Works
from resources.base import SYSTEM
from resources.shapes import LEVELS


ROW_HOLDS: list = []


def held(record, todo) -> bool:
    return any(hold(record, todo) for hold in ROW_HOLDS)


def open_rows(record) -> list:
    return Todos(record, actor=SYSTEM)._standing()


def asked(record, todo) -> bool:
    return any(todo.ref in q.refs for q in Questions(record, actor=SYSTEM)._standing())


def waiting_rows(record, numbers: set | None = None) -> list:
    return [t for t in Todos(record, actor=SYSTEM)._standing() if (numbers is None or t.n in numbers) and t.blocked and not asked(record, t)]


def named_rows(rows: list) -> str:
    return "; ".join(f"to-do {t.n}, {t.title}" for t in rows)


def worked(record) -> set:
    return {int(w.todo) for w in Works(record, actor=SYSTEM)._standing() if w.todo}


def ready(record) -> list:
    todos, taken = Todos(record, actor=SYSTEM), worked(record)
    fit = [t for t in open_rows(record) if not t.blocked and not t.assigned and t.n not in taken and not todos.waits(t) and not asked(record, t) and not held(record, t)]
    return sorted(fit, key=lambda t: (-int(t.priority or LEVELS["default"]), t.n))


def next(record):
    rows = ready(record)
    return rows[0] if rows else None
