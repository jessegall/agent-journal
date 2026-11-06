from core.base.command.context import Context
from core.base.caller.caller import Caller
from core.base.database.kept_rows import KeptRows
from core.base.query.conditions.has_value import HasValue
from core.base.query.queries import Queries
from core.modules.messages.support.assigned_work_sources import AssignedWorkSources
from core.modules.messages.support.work_source_snapshot import WorkSourceSnapshot
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worker_task_source import WorkerTaskSource
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


class WorkerTaskSources(AssignedWorkSources):
    """Reads the current task's captured request without consulting the parent's selection."""

    def __init__(self, worktrees: WorktreeQuery, queries: Queries, kept: KeptRows) -> None:
        self.worktrees, self.queries, self.kept = worktrees, queries, kept

    def for_task(self, task_id: int, context: Context | Caller) -> WorkSourceSnapshot | None:
        worktree = self.worktrees.worker_worktree(context.actor.id)
        if worktree is None or worktree.task_id != task_id or worktree.state is not WorktreeState.CUT:
            return None
        return self.current(context)

    def current(self, context: Context | Caller) -> WorkSourceSnapshot | None:
        worktree = self.worktrees.worker_worktree(context.actor.id)
        if worktree is None:
            return None
        if worktree.state is not WorktreeState.CUT:
            return WorkSourceSnapshot(None, 0, worktree.environment_id)
        source = self.kept.read_newest("worker_task_sources",
                                lambda: self.queries.query(WorkerTaskSource).filter(worktree_id=worktree.id, task_id=worktree.task_id)
                                .matching(HasValue("started_at")).newest().first(),
                                "worktree_id = ? AND task_id = ? AND started_at IS NOT NULL", [worktree.id, worktree.task_id], name="workers.current-task-source")
        if source is None:
            return WorkSourceSnapshot(None, 0, worktree.environment_id)
        return WorkSourceSnapshot(source.source_message_id, source.source_version, source.environment_id, source.source_unavailable,
                                  selecting_actor_id=source.creator_id)
