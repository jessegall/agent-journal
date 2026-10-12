from controllers.types import Questions, Todos, Works
from controllers.types import Helpers
from controllers.helpers.reuse import kept
from resources.base import SYSTEM, WHOM

from declaring.extension import Extension


ROW_HOLDS = Extension()


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


def helping(record) -> list:
    """The helpers and subagents of this environment that are working right now."""
    return [one for one in kept(record, Helpers(record, actor=SYSTEM).rows.standing()) if not one.idle]


def still_next(journal, rows: tuple[str, ...]) -> bool:
    open_work = [w for w in journal.get(Works).rows.standing() if not w.parked]
    named_work = {ref for ref in rows if ref.startswith("work:")}
    return any(t.ref in rows for t in ready(journal.record)) and {w.ref for w in open_work} == named_work and not any(w.awaiting for w in open_work)


def still_helped(journal, rows: tuple[str, ...]) -> bool:
    waiting = [w for w in journal.get(Works).rows.standing() if w.awaiting and w.ref in rows]
    return bool(waiting) and any(t.ref in rows for t in ready(journal.record)) and bool(helping(journal.record))


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


def free(record, todo) -> bool:
    """Whether nothing holds a row back: it is not blocked, does not wait on another row or on a question, and no feature holds it."""
    return not todo.blocked and not Todos(record, actor=SYSTEM).waits(todo) and todo.ref not in questioned(record) and not held(record, todo)


def ready(record) -> list:
    taken = worked(record)
    fit = [t for t in open_rows(record) if takeable(t) and free(record, t) and not t.assigned and t.n not in taken]
    return sorted(fit, key=lambda t: (-int(t.priority), t.creation_order()))


def says_what_is_ready(record) -> tuple[bool, bool]:
    """Whether this environment holds open rows, and whether any of them can be taken: what ready means, answered by the feature that owns it."""
    return bool(open_rows(record)), bool(ready(record))


NOTHING_IN_SIGHT = "nothing is open at all"


def in_sight(record) -> str:
    """What this environment holds, in one line, so a check-in names what the agent could be doing instead of only asking."""
    counted = ((len(open_rows(record)), "open to-dos"),
               (len(waiting_rows(record)), "of them blocked"),
               (len(Questions(record, actor=SYSTEM).rows.standing()), "questions waiting on the user"),
               (len(helping(record)), "helpers working"))
    said = [f"{count} {what}" for count, what in counted if count]
    return ", ".join(said) if said else NOTHING_IN_SIGHT
