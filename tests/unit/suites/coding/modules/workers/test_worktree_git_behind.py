from tests.unit.support.declared_merge_builds import declared_merge_builds
from pathlib import Path

import pytest

from engine.errors.refusal import Refusal
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from tests.unit.support.plain_executor import plain_executor
from tests.unit.suites.coding.modules.workers.test_worktree_git_own_files import BASE_BRANCH, SampleRepository

WORKER_BRANCH = "workers/one"
DIFFERENT_BRANCH = "workers/other"


def cut_worktree(tmp_path, base_branch: str = BASE_BRANCH, name: str = "worktree", branch: str = WORKER_BRANCH) -> tuple[SampleRepository, Worktree]:
    repository = SampleRepository(tmp_path / "repository")
    if not repository.folder.exists():
        repository.folder.mkdir(parents=True)
        repository.git("init", "--initial-branch", BASE_BRANCH)
        repository.committed("cart.py", "TOTAL = 0\n", "The cart")
    folder = tmp_path / name
    repository.git("worktree", "add", "-b", branch, str(folder), base_branch)
    return repository, Worktree(session_agent_id=1, task_id=1, creator_id=1, folder=str(folder), branch=branch, base_branch=base_branch, base_commit=repository.tip(base_branch))


def git() -> WorktreeGit:
    return WorktreeGit(None, plain_executor(), declared_merge_builds())


def merged_branch(repository: SampleRepository, branch: str, commits: int) -> None:
    repository.git("checkout", "-b", branch, BASE_BRANCH)
    for number in range(commits):
        repository.committed(f"{branch.replace('/', '_')}_{number}.py", f"N = {number}\n", f"Commit {number} of {branch}")
    repository.git("checkout", BASE_BRANCH)
    repository.git("merge", "--no-ff", "-m", f"Merge {branch}", branch)


def worker_commits(worktree: Worktree, count: int) -> None:
    for number in range(count):
        SampleRepository(worktree_folder(worktree)).committed(f"own_{number}.py", f"OWN = {number}\n", f"Own commit {number}")


def worktree_folder(worktree: Worktree) -> Path:
    return Path(worktree.folder)


def test_a_no_ff_merge_of_a_four_commit_branch_counts_once(tmp_path):
    repository, worktree = cut_worktree(tmp_path)
    merged_branch(repository, DIFFERENT_BRANCH, 4)
    assert git().behind(worktree) == 1


def test_five_own_commits_on_an_unmoved_base_count_nothing(tmp_path):
    _, worktree = cut_worktree(tmp_path)
    worker_commits(worktree, 5)
    assert git().behind(worktree) == 0


def test_a_commit_made_straight_on_the_base_counts_once(tmp_path):
    repository, worktree = cut_worktree(tmp_path)
    repository.committed("tax.py", "TAX = 1\n", "Tax on the base")
    assert git().behind(worktree) == 1


def test_two_worktrees_cut_from_different_bases_count_only_their_own_base(tmp_path):
    repository, first = cut_worktree(tmp_path)
    repository.git("branch", "other-base", BASE_BRANCH)
    _, second = cut_worktree(tmp_path, base_branch="other-base", name="second", branch="workers/two")
    repository.committed("tax.py", "TAX = 1\n", "Tax on the base")
    assert (git().behind(first), git().behind(second)) == (1, 0)


def test_a_merge_of_this_worktrees_own_earlier_commits_is_not_counted_but_another_workers_merge_is(tmp_path):
    repository, worktree = cut_worktree(tmp_path)
    worker_commits(worktree, 2)
    repository.git("merge", "--no-ff", "-m", "Merge the first part of this worker", WORKER_BRANCH)
    assert git().behind(worktree) == 0
    merged_branch(repository, DIFFERENT_BRANCH, 1)
    assert git().behind(worktree) == 1


def test_a_deleted_base_branch_is_refused_and_never_counted_as_nothing_behind(tmp_path):
    _, worktree = cut_worktree(tmp_path)
    removed = Worktree(session_agent_id=1, task_id=1, creator_id=1, folder=worktree.folder, branch=worktree.branch, base_branch="gone", base_commit=worktree.base_commit)
    with pytest.raises(Refusal, match="branch gone does not exist"):
        git().behind(removed)


def test_base_changes_lists_the_files_of_each_base_commit_merges_included(tmp_path):
    repository, worktree = cut_worktree(tmp_path)
    assert git().base_changes(worktree, repository.tip("base")) == ()
    repository.committed("tax.py", "TAX = 1\n", "Tax on the base")
    merged_branch(repository, DIFFERENT_BRANCH, 2)
    changes = git().base_changes(worktree, repository.tip("base"))
    assert [(change.subject, change.files) for change in changes] == [
        (f"Merge {DIFFERENT_BRANCH}", ("workers_other_0.py", "workers_other_1.py")),
        ("Tax on the base", tuple(["tax.py"])),
    ]
    assert all(len(change.short_id) >= 7 for change in changes)


class CountingGit(WorktreeGit):
    """Keeps the git command of every call, so a look can be held to its count."""

    def __init__(self) -> None:
        super().__init__(None, plain_executor(), declared_merge_builds())
        self.commands: list[str] = []

    def git(self, folder, limit_seconds, *arguments):
        self.commands.append(arguments[0])
        return super().git(folder, limit_seconds, *arguments)


def test_counting_a_worktree_takes_one_rev_list_and_no_walk_of_the_whole_history(tmp_path):
    repository, worktree = cut_worktree(tmp_path)
    for number in range(4):
        repository.committed(f"base_{number}.py", "B\n", f"Base {number}")
    counting = CountingGit()
    assert counting.behind(worktree) == 4
    assert counting.commands == ["rev-parse", "rev-list"]
