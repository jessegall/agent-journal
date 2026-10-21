from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class RowSettled(RowEvent):
    """A row something waited on is settled: a task closed, a question answered; ref names it as table:id."""

    ref: str
    outcome: str = ""
    """What the row came to, in the words a wait on it is told: output 7 finished, check 3 passed."""
