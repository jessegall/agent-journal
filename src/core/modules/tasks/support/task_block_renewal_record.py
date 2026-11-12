from typing import TypedDict


class TaskBlockRenewalRecord(TypedDict):
    """A renewal of the block of a task, as the task_inspections view writes it."""

    id: int
    reason: str
    created_at: str
