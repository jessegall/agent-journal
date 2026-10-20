from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class TaskClosed(RowEvent):
    """A task was closed: done, parked or cancelled."""

    task_id: int
