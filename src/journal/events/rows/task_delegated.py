from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class TaskDelegated(RowEvent):
    """A task was handed to a worker, which works it from now on."""

    task_id: int
    title: str
