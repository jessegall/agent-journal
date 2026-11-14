from engine.query.query import Query
from engine.database.kept_rows import KeptRows
from engine.event.moved import Moved
from engine.command.context import Context
from engine.listener.save_listener import SaveListener
from engine.query.conditions.has_value import HasValue
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.lifecycles.agent_line_lifecycle import AgentLineLifecycle
from suites.coding.modules.workers.models.worker_task_source import WorkerTaskSource
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_job import WORKER_JOB_SOURCE

UNSTARTED_REASON = "every source not yet started is matched against the delivered line"
UNSTARTED_NAME = "workers.unstarted_task_sources"


class WorkerJobSourceListener(SaveListener[Moved[AgentLine]]):
    """Activates a follow-up's source when its worker receives it for the current task. The sources not yet started
    are read once for every line a hook delivers."""

    name = "workers.job-source"
    moves = [AgentLineLifecycle.deliver, AgentLineLifecycle.enter]

    def __init__(self, queries: Queries, worktrees: WorktreeQuery, repository: Repository, kept: KeptRows) -> None:
        self.queries, self.worktrees, self.repository, self.kept = queries, worktrees, repository, kept

    def handle(self, event: Moved[AgentLine], context: Context) -> None:
        if event.row.source != WORKER_JOB_SOURCE:
            return
        source = next((unstarted for unstarted in self.unstarted() if unstarted.source_line_id == event.row.id), None)
        if source is None:
            return
        worktree = self.worktrees.worker_worktree(event.row.session_agent_id)
        if worktree is None or worktree.id != source.worktree_id or worktree.task_id != source.task_id:
            return
        self.repository.update(source, context, started_at=context.timestamp)
        self.kept.update(self.unstarted_sources(), lambda sources: tuple(unstarted for unstarted in sources if unstarted.id != source.id), name=UNSTARTED_NAME)

    def unstarted(self) -> tuple[WorkerTaskSource, ...]:
        sources = self.unstarted_sources()
        return self.kept.read(sources, lambda: tuple(sources.every_row(UNSTARTED_REASON)), name=UNSTARTED_NAME)

    def unstarted_sources(self) -> Query[WorkerTaskSource]:
        return self.queries.query(WorkerTaskSource).matching(IsNull("started_at")).matching(HasValue("source_line_id"))
