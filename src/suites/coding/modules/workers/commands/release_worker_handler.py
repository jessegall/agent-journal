from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.modules.environments.environment import Environment
from core.modules.tasks.task import Task
from suites.coding.modules.workers.commands.release_worker import ReleaseWorker
from suites.coding.modules.workers.commands.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.commands.worker_release import WorkerRelease
from suites.coding.modules.workers.models.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


class ReleaseWorkerHandler(Handler[ReleaseWorker, WorkerRelease]):
    """Opens the worker's task again, abandons its worktree and removes the folder; a branch with commits is kept."""

    command = ReleaseWorker

    def __init__(self, queries: Queries, worktrees: WorktreeQuery, repository: Repository, git: WorktreeGit) -> None:
        self.queries, self.worktrees, self.repository, self.git = queries, worktrees, repository, git

    def handle(self, command: ReleaseWorker, context: Context) -> WorkerRelease:
        worktree = self.worktrees.worker_worktree(command.worker_id)
        if worktree is None:
            raise Refusal(f"worker {command.worker_id} has no worktree out", "journal worktree list shows the worktrees")
        task = self.queries.query(Task).find(worktree.task_id)
        self.repository.save(task.release(context.timestamp, context.actor, command.reason), context)
        abandoned = self.repository.save(worktree.moved(WorktreeLifecycle.abandon), context)
        unmerged = self.git.remove(self.queries.query(Environment).find(abandoned.environment_id).folder, abandoned)
        removed = self.repository.save(abandoned.remove(context.timestamp, context.actor), context)
        return WorkerRelease(removed, removed.branch if unmerged else "")
