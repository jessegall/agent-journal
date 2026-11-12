from typing import TypedDict


class TaskLogRecord(TypedDict):
    """A line of a task's log, as the task_inspections view writes it."""

    id: int
    line: str
    created_at: str
