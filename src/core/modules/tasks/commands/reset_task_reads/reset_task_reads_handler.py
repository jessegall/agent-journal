from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.tasks.commands.reset_task_reads.reset_task_reads import ResetTaskReads
from core.modules.tasks.models.task_read import TaskRead


class ResetTaskReadsHandler(Handler[ResetTaskReads, None]):
    """Removes the reads of the agent."""

    command = ResetTaskReads

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: ResetTaskReads, context: Context) -> None:
        rows = tuple(self.queries.query(TaskRead).filter(session_agent_id=command.agent_id).all_rows())
        self.repository.delete_many_stored(rows, context)
