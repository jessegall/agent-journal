from core.base.change.moved import Moved
from core.base.command.context import Context
from core.base.listener.save_listener import SaveListener
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.lifecycles.agent_line_lifecycle import AgentLineLifecycle
from suites.coding.modules.workers.models.worker_task_source import WorkerTaskSource
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_job import WORKER_JOB_SOURCE


class WorkerJobSourceListener(SaveListener[Moved[AgentLine]]):
    """Activates a follow-up's source when its worker receives it for the current task."""

    name = "workers.job-source"
    moves = [AgentLineLifecycle.deliver, AgentLineLifecycle.enter]

    def __init__(self, queries: Queries, worktrees: WorktreeQuery, repository: Repository) -> None:
        self.queries, self.worktrees, self.repository = queries, worktrees, repository

    def handle(self, event: Moved[AgentLine], context: Context) -> None:
        if event.row.source != WORKER_JOB_SOURCE:
            return
        source = self.queries.query(WorkerTaskSource).filter(source_line_id=event.row.id).first()
        if source is None or source.started_at is not None:
            return
        worktree = self.worktrees.worker_worktree(event.row.session_agent_id)
        if worktree is None or worktree.id != source.worktree_id or worktree.task_id != source.task_id:
            return
        self.repository.update(source, context, started_at=context.timestamp)
