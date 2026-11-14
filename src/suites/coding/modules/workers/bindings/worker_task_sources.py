from engine.command.context import Context
from engine.caller.caller import Caller
from engine.database.kept_rows import KeptRows
from engine.query.conditions.has_value import HasValue
from engine.query.queries import Queries
from core.modules.messages.support.assigned_work_sources import AssignedWorkSources
from core.modules.messages.support.work_source_copy import WorkSourceCopy
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worker_task_source import WorkerTaskSource
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


class WorkerTaskSources(AssignedWorkSources):
    """Reads the current task's captured request without consulting the parent's selection."""

    def __init__(self, worktrees: WorktreeQuery, queries: Queries, kept: KeptRows) -> None:
        self.worktrees, self.queries, self.kept = worktrees, queries, kept

    def task_source(self, task_id: int, context: Context | Caller) -> WorkSourceCopy | None:
        worktree = self.worktrees.worker_worktree(context.actor.id)
        if worktree is None or worktree.task_id != task_id or worktree.state is not WorktreeState.CUT:
            return None
        return self.current(context)

    def current(self, context: Context | Caller) -> WorkSourceCopy | None:
        worktree = self.worktrees.worker_worktree(context.actor.id)
        if worktree is None:
            return None
        if worktree.state is not WorktreeState.CUT:
            return WorkSourceCopy(None, 0, worktree.environment_id)
        sources = self.queries.query(WorkerTaskSource).filter(worktree_id=worktree.id, task_id=worktree.task_id).matching(HasValue("started_at")).newest()
        source = self.kept.read_newest(sources, sources.first, name="workers.current-task-source")
        if source is None:
            return WorkSourceCopy(None, 0, worktree.environment_id)
        return WorkSourceCopy(source.source_message_id, source.source_version, source.environment_id, source.source_unavailable,
                                  selecting_actor_id=source.creator_id)
