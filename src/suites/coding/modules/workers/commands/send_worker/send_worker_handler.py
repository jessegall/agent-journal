from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.tasks.models.lifecycles.task_lifecycle import TaskLifecycle
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.send_worker.send_worker import SendWorker
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_job import WORKER_JOB_SOURCE


class SendWorkerHandler(Handler[SendWorker, AgentLine]):
    """Gives a worker that still has its worktree its next job as a line; a delivered worker's task goes back
    in hand."""

    command = SendWorker

    def __init__(self, queries: Queries, worktrees: WorktreeQuery, repository: Repository) -> None:
        self.queries, self.worktrees, self.repository = queries, worktrees, repository

    def handle(self, command: SendWorker, context: Context) -> AgentLine:
        worktree = self.worktrees.worker_worktree(command.worker_id)
        if worktree is None:
            raise Refusal(f"worker {command.worker_id} has no worktree", "journal worker dispatch <task> starts a new one")
        if worktree.state is WorktreeState.DELIVERED:
            self.repository.save(self.queries.query(Task).find(worktree.task_id).moved(TaskLifecycle.retest), context)
            self.repository.save(worktree.moved(WorktreeLifecycle.rework), context)
        return self.repository.save(AgentLine(agent_id=command.worker_id, creator_id=context.actor.id, text=command.job, source=WORKER_JOB_SOURCE), context)
