from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.tasks.clear_delegated_tasks import ClearDelegatedTasks
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.dependency_waits import DependencyWaits


class ClearDelegatedTasksHandler(Handler[ClearDelegatedTasks, None]):
    """Sets delegated_to to nothing on the open and started tasks delegated to the agent; those in testing stay with
    its worktree, whose merge closes them."""

    command = ClearDelegatedTasks

    def __init__(self, queries: Queries, repository: Repository, waits: DependencyWaits) -> None:
        self.queries, self.repository, self.waits = queries, repository, waits

    def handle(self, command: ClearDelegatedTasks, context: Context) -> None:
        tasks = tuple(self.queries.query(Task).filter(delegated_to=command.agent_id).matching(Among("state", (TaskState.OPEN, TaskState.STARTED))).all_rows())
        for task in tasks:
            self.repository.save_change(task, replace(task, delegated_to=None), context)
        self.waits.update_tasks([task.id for task in tasks], context)
