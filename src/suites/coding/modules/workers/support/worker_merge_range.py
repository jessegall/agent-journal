from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from engine.query.queries import Queries
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.support.work_units import UNIT_TASKS_REASON


TASK_NUMBER_MOST_DIGITS = 6


class WorkerMergeRange:
    """Reads a part of a worker's branch named by a task or a commit: the commit it ends at, and the worker's
    tasks whose commits lie in it, with every earlier commit carried along."""

    def __init__(self, git: WorktreeGit, queries: Queries) -> None:
        self.git, self.queries = git, queries

    @staticmethod
    def is_task_number(target: str) -> bool:
        return target.isdigit() and len(target) <= TASK_NUMBER_MOST_DIGITS

    def task_commit(self, worktree: Worktree, task_id: int) -> str | None:
        commits = self.git.task_commits(worktree, task_id)
        return commits[0].short_id if commits else None

    def is_branch_commit(self, worktree: Worktree, commit: str) -> bool:
        return self.git.branch_contains(worktree, commit)

    def leading_tasks(self, worktree: Worktree, commit: str) -> list[Task]:
        commits = self.git.branch_commits(worktree.folder, f"{worktree.base_commit}..{commit}")
        assigned = tuple(self.queries.query(Task).matching(TaskQuery.assignee(worktree.session_agent_id)).every_row(UNIT_TASKS_REASON))
        return [task for task in assigned if any(row.has_task_subject([task.id]) for row in commits)]
