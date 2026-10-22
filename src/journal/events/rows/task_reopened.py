from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class TaskReopened(RowEvent):
    """A blocked task was opened again, with the reason it opened as a clause: question 12 was answered or closed."""

    task_id: int
    reason: str
