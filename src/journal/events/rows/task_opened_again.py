from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class TaskOpenedAgain(RowEvent):
    """A blocked task was opened again, with what it waited on."""

    task_id: int
    on: str
