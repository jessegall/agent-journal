from dataclasses import replace

from core.base.command.context import Context
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_wait import TaskWait


class TaskWaits:
    """Ends a blocked task's waits, and opens the task when the last of them has ended."""

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def resolved(self, wait: TaskWait, context: Context) -> None:
        self.repository.save(replace(wait, ended_at=context.timestamp), context)
        task = self.queries.query(Task).find(wait.task_id)
        if task.state is TaskState.BLOCKED and not self.open_waits(task.id).exists():
            self.repository.save(task.moved(TaskLifecycle.unblock), context)

    def open_waits(self, task_id: int):
        return self.queries.query(TaskWait).filter(task_id=task_id).matching(IsNull("ended_at"))
