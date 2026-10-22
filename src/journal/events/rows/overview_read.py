from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class OverviewRead(RowEvent):
    """The agent looked at what is in flight here: the look owed at a start is paid."""

