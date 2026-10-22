from dataclasses import dataclass

from journal.events.rows.row_event import RowEvent


@dataclass(frozen=True, kw_only=True)
class TaskBriefed(RowEvent):
    """A task's brief was written anew; points names the points whose wording changed or that are new."""

    task_id: int
    points: tuple[int, ...]
