from pathlib import Path

from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from tests.unit.suites.coding.modules.workers.test_worktree_git_own_files import worker_checkout, worktree_row


def test_a_missing_test_checkout_is_made_at_the_named_commit(tmp_path):
    repository, folder = worker_checkout(tmp_path)
    first = repository.tip("base")
    repository.committed("cart.py", "TOTAL = 1\n", "The cart counts")
    worktree = worktree_row(repository, folder, first)
    checkout = WorktreeGit(None).commit_checkout(worktree, first)
    assert Path(checkout, "cart.py").read_text() == "TOTAL = 0\n"


def test_an_existing_test_checkout_moves_to_the_named_commit(tmp_path):
    repository, folder = worker_checkout(tmp_path)
    first = repository.tip("base")
    worktree = worktree_row(repository, folder, first)
    git = WorktreeGit(None)
    git.commit_checkout(worktree, first)
    (folder / "cart.py").write_text("TOTAL = 2\n")
    repository.git("commit", "-am", "The worker's cart", folder=folder)
    checkout = git.commit_checkout(worktree, repository.git("rev-parse", "HEAD", folder=folder).stdout.strip())
    assert Path(checkout, "cart.py").read_text() == "TOTAL = 2\n"
