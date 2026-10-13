from controllers.types import Questions, Works
from controllers.types import Helpers
from framework.readiness import carried_on, free, held, named_rows, open_rows, questioned, ready, takeable, waiting_rows, worked  # noqa: F401  what ready means is shared, and its callers here still name it
from resources.base import SYSTEM


def helping(record) -> list:
    """The helpers and subagents of this environment that are working right now."""
    return Helpers(record, actor=SYSTEM).working()


def still_next(journal, rows: tuple[str, ...]) -> bool:
    open_work = [w for w in journal.get(Works).rows.standing() if not w.parked]
    named_work = {ref for ref in rows if ref.startswith("work:")}
    return any(t.ref in rows for t in ready(journal.record)) and {w.ref for w in open_work} == named_work and not any(w.awaiting for w in open_work)


def still_helped(journal, rows: tuple[str, ...]) -> bool:
    waiting = [w for w in journal.get(Works).rows.standing() if w.awaiting and w.ref in rows]
    return bool(waiting) and any(t.ref in rows for t in ready(journal.record)) and bool(helping(journal.record))


def still_stopped(journal, rows: tuple[str, ...]) -> bool:
    return any(w.ref in rows for w in carried_on(journal.record))


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
