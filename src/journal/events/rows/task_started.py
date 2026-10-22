from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class TaskStarted(RowEvent):
    """A task was started."""

    task_id: int
    title: str
    plan_id: int
