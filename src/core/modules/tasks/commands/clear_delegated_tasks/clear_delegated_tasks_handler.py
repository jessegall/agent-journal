from core.modules.tasks.queries.task_query import TaskQuery
from dataclasses import replace

from engine.command.context import Context
from engine.command.handler import Handler
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.tasks.commands.clear_delegated_tasks.clear_delegated_tasks import ClearDelegatedTasks
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.dependency_waits import DependencyWaits
from core.modules.assignments.support.assignments import Assignments

CLEARED_TASKS_REASON = "clearing an agent's tasks takes back every open and started task assigned to it"


class ClearDelegatedTasksHandler(Handler[ClearDelegatedTasks, None]):
    """Sets delegated_to to nothing on the open and started tasks assigned to the agent; those in testing stay with
    the agent until their work is taken in."""

    command = ClearDelegatedTasks

    def __init__(self, queries: Queries, repository: Repository, waits: DependencyWaits, assignments: Assignments) -> None:
        self.queries, self.repository, self.waits, self.assignments = queries, repository, waits, assignments

    def handle(self, command: ClearDelegatedTasks, context: Context) -> None:
        tasks = tuple(self.queries.query(Task).matching(TaskQuery.assignee(command.agent_id)).matching(Among("state", (TaskState.OPEN, TaskState.STARTED))).every_row(CLEARED_TASKS_REASON))
        self.assignments.unassign_rows(tasks, context)
        for task in tasks:
            self.repository.save_change(task, replace(task, delegated_to=None), context)
        self.waits.update_tasks([task.id for task in tasks], context)
