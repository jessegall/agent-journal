from unittest.mock import Mock

from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.task_branch_commit import TaskBranchCommit
from suites.coding.modules.workers.support.worker_merge_range import WorkerMergeRange
from suites.coding.modules.workers.support.worktree_git import WorktreeGit

WORKTREE = Worktree(id=5, session_agent_id=1, task_id=7, creator_id=1, folder="/w", branch="worker", base_branch="version-5", commit_count=3, commit_short_id="c0ffee1")


def merge_range(*commits: TaskBranchCommit) -> WorkerMergeRange:
    git = Mock(spec=WorktreeGit)
    git.worktree_commits.return_value = commits
    return WorkerMergeRange(git, Mock())


def test_a_task_commit_carries_the_update_merges_after_it_and_stops_at_the_next_task():
    update = TaskBranchCommit("aaa1111", "Merge branch 'version-5' into worker", None)
    newer_task = TaskBranchCommit("bbb2222", "task 8: Add the tax", None)
    task = TaskBranchCommit("ccc3333", "task 7: Fix the cart", None)
    earlier_update = TaskBranchCommit("ddd4444", "Merge branch 'version-5' into worker", None)
    assert merge_range(update, task).task_commit(WORKTREE, 7) == "aaa1111"
    assert merge_range(update, newer_task, earlier_update, task).task_commit(WORKTREE, 7) == "ddd4444"
    assert merge_range(newer_task, task).task_commit(WORKTREE, 7) == "ccc3333"
    assert merge_range(newer_task).task_commit(WORKTREE, 7) is None
