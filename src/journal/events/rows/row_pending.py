from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class RowPending(RowEvent):
    """A row came into being that the session which made it waits on until it settles: a worker sent out; ref names it as table:id and label in words."""

    ref: str
    label: str
    awaiter: str
