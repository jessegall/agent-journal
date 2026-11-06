from dataclasses import replace

from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.commands.cancel_worker_opening.cancel_worker_opening import CancelWorkerOpening
from suites.coding.modules.workers.commands.release_worker.release_worker import ReleaseWorker
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.support.release_outcome import ReleaseOutcome
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


WAITING_STATES = (TaskState.OPEN, TaskState.BLOCKED)


class ReleaseWorkerHandler(Handler[ReleaseWorker, ReleaseOutcome]):
    """Releases tasks still assigned to the worker and removes its worktree, keeping a branch with commits; a
    worktree that was never cut is undone as a failed dispatch is."""

    command = ReleaseWorker

    def __init__(self, queries: Queries, worktrees: WorktreeQuery, repository: Repository, git: WorktreeGit, rows: EventRows, environments: EnvironmentRows, bus: Bus) -> None:
        self.queries, self.worktrees, self.repository, self.git, self.bus = queries, worktrees, repository, git, bus
        self.rows, self.environments = rows, environments

    def handle(self, command: ReleaseWorker, context: Context) -> ReleaseOutcome:
        worktree = self.worktrees.worker_worktree(command.worker_id)
        if worktree is None:
            raise Refusal(f"worker {command.worker_id} has no worktree out", "journal worker-worktree list shows the worktrees")
        if worktree.state is WorktreeState.NEW:
            unmerged = self.git.remove(self.environments.find(worktree.environment_id).folder, worktree)
            self.bus.dispatch(CancelWorkerOpening(worktree.id), context)
            return ReleaseOutcome(worktree, worktree.branch if unmerged else "")
        abandoned = self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.abandon), context)
        task = self.rows.required(Task, worktree.task_id)
        if task.delegated_to == worktree.session_agent_id:
            self.repository.save_change(task, replace(task.release(context.timestamp, context.actor, command.reason), delegated_to=None), context)
        for delegated in tuple(self.queries.query(Task).filter(delegated_to=worktree.session_agent_id).matching(Among("state", WAITING_STATES)).all_rows()):
            self.repository.update(delegated, context, delegated_to=None)
        unmerged = self.git.remove(self.environments.find(abandoned.environment_id).folder, abandoned)
        removed = self.repository.save_change(abandoned, abandoned.remove(context.timestamp, context.actor), context)
        return ReleaseOutcome(removed, removed.branch if unmerged else "")
