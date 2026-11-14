import pytest

from engine.errors.refusal import Refusal
from engine.process.door.execution import Execution
from engine.time.polled_wait import PolledWait
from suites.coding.modules.workers.support import worktree_git
from suites.coding.modules.workers.support.worktree_git import WorktreeGit

LOCKED = Execution(None, 128, "", "fatal: Unable to create '/project/.git/worktrees/worker-1/index.lock': File exists.")
FINISHED = Execution(None, 0, "", "")


class LockedExecutor:
    """Answers that the index is locked for the first runs it is given, then that the step ran."""

    def __init__(self, locked_runs: int) -> None:
        self.locked_runs, self.runs = locked_runs, 0

    def execute(self, request):
        self.runs += 1
        return LOCKED if self.runs <= self.locked_runs else FINISHED


def worktree_git_with(executor: LockedExecutor) -> WorktreeGit:
    git = WorktreeGit.__new__(WorktreeGit)
    git.executor = executor
    return git


@pytest.fixture(autouse=True)
def quick_wait(monkeypatch):
    monkeypatch.setattr(worktree_git, "INDEX_LOCK_WAIT", PolledWait(limit_seconds=1, pause_seconds=0))


def test_a_step_that_finds_the_index_locked_runs_again_once_the_lock_has_gone():
    executor = LockedExecutor(locked_runs=2)
    finished = worktree_git_with(executor).checked("/tmp/worker-1", 5, "update-index", "--skip-worktree", "--", "CLAUDE.md")
    assert finished.returncode == 0 and executor.runs == 3


def test_a_step_whose_index_stays_locked_says_the_worktree_is_busy():
    with pytest.raises(Refusal, match="is busy: another git of it held its index.lock"):
        worktree_git_with(LockedExecutor(locked_runs=10**9)).checked("/tmp/worker-1", 5, "update-index", "--skip-worktree", "--", "CLAUDE.md")


def test_another_failure_is_not_tried_again():
    executor = LockedExecutor(locked_runs=0)
    executor.execute = lambda request: Execution(None, 1, "", "fatal: not a git repository")
    assert worktree_git_with(executor).git("/tmp/worker-1", 5, "status").returncode == 1
