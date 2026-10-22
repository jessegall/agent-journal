from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class TaskOpened(RowEvent):
    """A task was made open, free for an agent to take up; row_id is the task's."""

    title: str
