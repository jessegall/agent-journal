from dataclasses import dataclass

from engine.database.statement import Statement
from core.modules.tasks.models.enums.task_state import TaskState

UNFINISHED_WORK_STATES = (TaskState.OPEN, TaskState.STARTED, TaskState.TESTING)


@dataclass(frozen=True)
class UnfinishedTaskHolder:
    """Matches agents that an open, started or testing task is delegated to."""

    def statement(self) -> Statement:
        marks = ", ".join("?" for _ in UNFINISHED_WORK_STATES)
        return Statement(f"id IN (SELECT delegated_to FROM tasks WHERE closed_at IS NULL AND delegated_to IS NOT NULL AND state IN ({marks}))",
                         [state.value for state in UNFINISHED_WORK_STATES])
