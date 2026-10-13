"""Which to-dos the agent could take now, and why the others cannot: what ready means, shared by every feature that nudges about the list."""

from controllers.questions import Questions
from controllers.todos import Todos
from controllers.works import Works
from declaring.registries import ROW_HOLDS
from resources.base import SYSTEM, WHOM


def held(record, todo) -> bool:
    return any(hold(record, todo) for hold in ROW_HOLDS.each(record))


def open_rows(record) -> list:
    return Todos(record, actor=SYSTEM).rows.standing()


def questioned(record) -> set[str]:
    return {ref for q in Questions(record, actor=SYSTEM).rows.standing() for ref in q.refs}


def carried_on(record) -> list:
    from framework.loaded import FEATURES
    if "work_tracking" not in FEATURES or not FEATURES["work_tracking"].on(record, "carry on"):
        return []
    asked = questioned(record)
    return [w for w in Works(record, actor=SYSTEM).rows.standing() if not w.parked and not w.awaiting and f"todo:{w.todo}" not in asked]


def waiting_rows(record, numbers: set | None = None) -> list:
    asked = questioned(record)
    return [t for t in Todos(record, actor=SYSTEM).rows.standing() if (numbers is None or t.n in numbers) and t.blocked and t.ref not in asked]


def named_rows(rows: list) -> str:
    return "; ".join(f"to-do {t.n}, {t.title}" for t in rows)


def worked(record) -> set:
    return {int(w.todo) for w in Works(record, actor=SYSTEM).rows.standing() if w.todo}


STARTED = ("started",)


def takeable(todo) -> bool:
    """Whether a row is the agent's own to take: not handed to someone else and not already under way."""
    return not todo.data.get(WHOM) and todo.data.get("status") not in STARTED


def free(record, todo) -> bool:
    """Whether nothing holds a row back: it is not blocked, does not wait on another row or on a question, and no feature holds it."""
    return not todo.blocked and not Todos(record, actor=SYSTEM).waits(todo) and todo.ref not in questioned(record) and not held(record, todo)


def ready(record) -> list:
    taken = worked(record)
    fit = [t for t in open_rows(record) if takeable(t) and free(record, t) and not t.assigned and t.n not in taken]
    return sorted(fit, key=lambda t: (-int(t.priority), t.creation_order()))
