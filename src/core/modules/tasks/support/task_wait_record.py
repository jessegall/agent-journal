from typing import TypedDict


class TaskWaitRecord(TypedDict):
    """A task another task waits on, as the task_inspections view writes it."""

    id: int
    title: str
    state: str
