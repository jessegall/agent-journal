from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.base.tasks.clear_delegated_tasks import ClearDelegatedTasks
from core.modules.tasks.models.task import Task


class ClearDelegatedTasksHandler(Handler[ClearDelegatedTasks, None]):
    """Sets delegated_to to nothing on the tasks delegated to the agent."""

    command = ClearDelegatedTasks

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: ClearDelegatedTasks, context: Context) -> None:
        for task in tuple(self.queries.query(Task).filter(delegated_to=command.agent_id).all_rows()):
            self.repository.save(replace(task, delegated_to=None), context)
