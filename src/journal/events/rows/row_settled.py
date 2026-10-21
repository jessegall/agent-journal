from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class RowSettled(RowEvent):
    """A row something waited on is settled: a task closed, a question answered; ref names it as table:id."""

    ref: str
    outcome: str = ""
