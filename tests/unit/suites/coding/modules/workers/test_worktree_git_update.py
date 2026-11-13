from tests.unit.support.declared_merge_builds import declared_merge_builds
import subprocess
from pathlib import Path

import pytest

from engine.errors.refusal import Refusal
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from tests.unit.support.plain_executor import plain_executor
from tests.unit.suites.coding.modules.workers.test_worktree_git_behind import cut_worktree
from tests.unit.suites.coding.modules.workers.test_worktree_git_own_files import SampleRepository


def git() -> WorktreeGit:
    return WorktreeGit(None, plain_executor(), declared_merge_builds())


def own(worktree: Worktree) -> SampleRepository:
    return SampleRepository(Path(worktree.folder))


def text(worktree: Worktree, name: str) -> str:
    return (Path(worktree.folder) / name).read_text()


def test_a_clean_update_keeps_uncommitted_changes_in_two_files_and_puts_own_commits_on_the_new_tip(tmp_path):
    repository, worktree = cut_worktree(tmp_path)
    for number in range(3):
        own(worktree).committed(f"own_{number}.py", "OWN\n", f"Own {number}")
    repository.committed("tax.py", "TAX = 1\n", "Tax on the base")
    (Path(worktree.folder) / "cart.py").write_text("TOTAL = 5\n")
    (Path(worktree.folder) / "own_0.py").write_text("CHANGED\n")
    (Path(worktree.folder) / "notes.txt").write_text("untracked\n")
    update = git().update(worktree)
    tip = repository.tip("base")
    assert (update.is_clean(), update.base_commit, update.stash_id) == (True, tip, "")
    assert (text(worktree, "cart.py"), text(worktree, "own_0.py"), text(worktree, "notes.txt"), text(worktree, "tax.py")) == ("TOTAL = 5\n", "CHANGED\n", "untracked\n", "TAX = 1\n")
    assert own(worktree).git("rev-list", "--count", f"{tip}..HEAD").stdout.strip() == "3"


def test_an_update_already_up_to_date_changes_nothing(tmp_path):
    repository, worktree = cut_worktree(tmp_path)
    head = own(worktree).tip("HEAD")
    update = git().update(worktree)
    assert (update.base_commit, update.is_clean(), update.unchanged, own(worktree).tip("HEAD")) == (repository.tip("base"), True, True, head)


def test_a_failed_rebase_falls_back_to_a_merge_with_plain_markers(tmp_path):
    repository, worktree = cut_worktree(tmp_path)
    own(worktree).committed("cart.py", "TOTAL = 1\n", "Worker cart")
    repository.committed("cart.py", "TOTAL = 2\n", "Base cart")
    update = git().update(worktree)
    assert (update.conflicts, update.stash_id) == (tuple(["cart.py"]), "")
    assert "<<<<<<<" in text(worktree, "cart.py") and git().is_merging(worktree.folder)


def test_a_fallback_merge_that_is_clean_puts_the_uncommitted_changes_back(tmp_path):
    repository, worktree = cut_worktree(tmp_path)
    own(worktree).committed("cart.py", "TOTAL = 1\nA\nB\nC\nD\n", "Worker cart")
    repository.committed("cart.py", "TOTAL = 2\n", "Base cart")
    repository.committed("cart.py", "TOTAL = 1\nA\nB\nC\nD\n", "Base takes the worker cart")
    own(worktree).committed("shop.py", "SHOP = 1\n", "Worker shop")
    (Path(worktree.folder) / "shop.py").write_text("SHOP = 2\n")
    update = git().update(worktree)
    assert (update.is_clean(), text(worktree, "shop.py"), git().is_merging(worktree.folder)) == (True, "SHOP = 2\n", False)


def test_a_fallback_merge_that_conflicts_leaves_its_markers_and_keeps_the_changes_in_a_named_stash(tmp_path):
    repository, worktree = cut_worktree(tmp_path)
    own(worktree).committed("cart.py", "TOTAL = 1\n", "Worker cart")
    repository.committed("cart.py", "TOTAL = 2\n", "Base cart")
    (Path(worktree.folder) / "shop.py").write_text("SHOP = 2\n")
    update = git().update(worktree)
    assert update.conflicts == tuple(["cart.py"]) and update.stash_id
    assert not (Path(worktree.folder) / "shop.py").exists()
    assert update.stash_id in own(worktree).git("stash", "list", "--format=%H").stdout


def test_open_markers_refuse_and_nothing_moves(tmp_path):
    repository, worktree = cut_worktree(tmp_path)
    repository.committed("tax.py", "TAX = 1\n", "Tax on the base")
    (Path(worktree.folder) / "cart.py").write_text("<<<<<<< HEAD\nA\n=======\nB\n>>>>>>> base\n")
    head = own(worktree).tip("HEAD")
    with pytest.raises(Refusal, match="conflict markers remain in cart.py"):
        git().update(worktree)
    assert own(worktree).tip("HEAD") == head


def test_a_merge_in_progress_refuses(tmp_path):
    repository, worktree = cut_worktree(tmp_path)
    own(worktree).committed("cart.py", "TOTAL = 1\n", "Worker cart")
    repository.committed("cart.py", "TOTAL = 2\n", "Base cart")
    started_merge(worktree)
    (Path(worktree.folder) / "cart.py").write_text("TOTAL = 3\n")
    with pytest.raises(Refusal, match="a merge is in progress, settle it and commit first"):
        git().update(worktree)


def started_merge(worktree: Worktree) -> None:
    """A merge of the base the worker started itself and left with its conflict."""
    subprocess.run(["git", "-c", "user.name=Sample", "-c", "user.email=sample@example.com", "-C", worktree.folder, "merge", "base"], capture_output=True, check=False)


def test_a_missing_base_branch_changes_nothing(tmp_path):
    _, worktree = cut_worktree(tmp_path)
    head = own(worktree).tip("HEAD")
    removed = Worktree(session_agent_id=1, task_id=1, creator_id=1, folder=worktree.folder, branch=worktree.branch, base_branch="gone", base_commit=worktree.base_commit)
    with pytest.raises(Refusal, match="branch gone does not exist"):
        git().update(removed)
    assert own(worktree).tip("HEAD") == head


def test_a_left_over_stash_is_restored_first(tmp_path):
    repository, worktree = cut_worktree(tmp_path)
    (Path(worktree.folder) / "cart.py").write_text("TOTAL = 7\n")
    own(worktree).git("stash", "push", "--message", f"journal merge of {worktree.branch}")
    repository.committed("tax.py", "TAX = 1\n", "Tax on the base")
    git().update(worktree)
    assert text(worktree, "cart.py") == "TOTAL = 7\n"


def test_two_worktrees_updating_do_not_take_each_others_stash(tmp_path):
    repository, first = cut_worktree(tmp_path)
    _, second = cut_worktree(tmp_path, name="second", branch="workers/two")
    repository.committed("tax.py", "TAX = 1\n", "Tax on the base")
    (Path(first.folder) / "cart.py").write_text("FIRST\n")
    (Path(second.folder) / "cart.py").write_text("SECOND\n")
    git().update(first)
    git().update(second)
    assert (text(first, "cart.py"), text(second, "cart.py")) == ("FIRST\n", "SECOND\n")


def test_a_stash_that_does_not_apply_is_kept_and_named(tmp_path):
    repository, worktree = cut_worktree(tmp_path)
    (Path(worktree.folder) / "tax.py").write_text("TAX = 9\n")
    repository.committed("tax.py", "TAX = 2\n", "Base adds tax")
    with pytest.raises(Refusal) as refused:
        git().update(worktree)
    stashes = own(worktree).git("stash", "list", "--format=%H").stdout.split()
    assert stashes and f"apply them with git stash apply {stashes[0]}" in refused.value.text
