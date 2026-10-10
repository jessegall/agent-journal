from controllers.types import Questions, Todos, Works
from resources.base import SYSTEM, WHOM
from resources.shapes import LEVELS
from engine.extension import Extension


ROW_HOLDS = Extension()


def held(record, todo) -> bool:
    return any(hold(record, todo) for hold in ROW_HOLDS.each(record))


def open_rows(record) -> list:
    return Todos(record, actor=SYSTEM).rows.standing()


def questioned(record) -> set[str]:
    return {ref for q in Questions(record, actor=SYSTEM).rows.standing() for ref in q.refs}


def carried_on(record) -> list:
    from features import FEATURES
    if "work_tracking" not in FEATURES or not FEATURES["work_tracking"].on(record, "carry on"):
        return []
    asked = questioned(record)
    return [w for w in Works(record, actor=SYSTEM).rows.standing() if not w.parked and not w.awaiting and f"todo:{w.todo}" not in asked]


def still_next(journal, rows: tuple[str, ...]) -> bool:
    open_work = [w for w in journal.get(Works).rows.standing() if not w.parked]
    named_work = {ref for ref in rows if ref.startswith("work:")}
    return any(t.ref in rows for t in ready(journal.record)) and {w.ref for w in open_work} == named_work and not any(w.awaiting for w in open_work)


def still_stopped(journal, rows: tuple[str, ...]) -> bool:
    return any(w.ref in rows for w in carried_on(journal.record))


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


def ready(record) -> list:
    todos, taken, asked = Todos(record, actor=SYSTEM), worked(record), questioned(record)
    fit = [t for t in open_rows(record) if takeable(t) and not t.blocked and not t.assigned and t.n not in taken and not todos.waits(t) and t.ref not in asked and not held(record, t)]
    return sorted(fit, key=lambda t: (-int(t.priority or LEVELS["default"]), t.creation_order()))
