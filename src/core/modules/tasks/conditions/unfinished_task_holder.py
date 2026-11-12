from dataclasses import dataclass

from engine.database.statement import Statement
from core.modules.tasks.models.enums.task_state import TaskState

UNFINISHED_WORK_STATES = (TaskState.OPEN, TaskState.STARTED, TaskState.TESTING)


@dataclass(frozen=True)
class UnfinishedTaskHolder:
    """Matches agents that an open, started or testing task is assigned to."""

    def statement(self) -> Statement:
        marks = ", ".join("?" for _ in UNFINISHED_WORK_STATES)
        return Statement("id IN (SELECT assignments.actor_id FROM assignments JOIN tasks ON tasks.id = assignments.subject_id"
                         f" WHERE assignments.subject_model = 'task' AND tasks.closed_at IS NULL AND tasks.state IN ({marks}))",
                         [state.value for state in UNFINISHED_WORK_STATES])
