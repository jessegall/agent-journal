from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class MarkDecided(RowEvent):
    """The agent decided what to keep at a context mark: the mark owed is paid."""

    mark: int
