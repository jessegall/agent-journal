from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.tasks.models.task import Task
from engine.listener.rows.event_rows import EventRows
from suites.coding.modules.workers.commands.open_kept_worktree.open_kept_worktree import OpenKeptWorktree
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worker_branch_names import WorkerBranchNames


class OpenKeptWorktreeHandler(Handler[OpenKeptWorktree, Worktree]):
    """Saves the row of a new worktree in the folder the worker had, so its session resumes there, on a new branch
    named after the worker's first branch and the position of this worktree among the worker's worktrees."""

    command = OpenKeptWorktree

    def __init__(self, rows: EventRows, repository: Repository, environments: EnvironmentRows, worktrees: WorktreeQuery) -> None:
        self.rows, self.repository, self.environments, self.worktrees = rows, repository, environments, worktrees

    def handle(self, command: OpenKeptWorktree, context: Context) -> Worktree:
        task = self.rows.required(Task, command.task_id)
        last = self.worktrees.required_newest_worktree(command.worker_id)
        previous_worktrees = self.worktrees.worker_worktrees(command.worker_id)
        branch = WorkerBranchNames(previous_worktrees[0].branch).branch(len(previous_worktrees) + 1)
        return self.repository.save(Worktree(session_agent_id=command.worker_id, task_id=task.id, creator_id=context.actor.id, folder=last.folder,
                                             branch=branch, base_branch=self.environments.find(task.environment_id).branch), context)
