from tests.unit.support.plain_executor import plain_executor
from pathlib import Path

from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from tests.unit.suites.coding.modules.workers.test_worktree_git_own_files import worker_checkout, worktree_row


def test_a_missing_test_checkout_is_made_at_the_named_commit(tmp_path):
    repository, folder = worker_checkout(tmp_path)
    first = repository.tip("base")
    repository.committed("cart.py", "TOTAL = 1\n", "The cart counts")
    worktree = worktree_row(repository, folder, first)
    checkout = WorktreeGit(None, plain_executor()).commit_checkout(worktree, first)
    assert Path(checkout, "cart.py").read_text() == "TOTAL = 0\n"


def test_an_existing_test_checkout_moves_to_the_named_commit(tmp_path):
    repository, folder = worker_checkout(tmp_path)
    first = repository.tip("base")
    worktree = worktree_row(repository, folder, first)
    git = WorktreeGit(None, plain_executor())
    git.commit_checkout(worktree, first)
    (folder / "cart.py").write_text("TOTAL = 2\n")
    repository.git("commit", "-am", "The worker's cart", folder=folder)
    checkout = git.commit_checkout(worktree, repository.git("rev-parse", "HEAD", folder=folder).stdout.strip())
    assert Path(checkout, "cart.py").read_text() == "TOTAL = 2\n"


def test_an_existing_test_checkout_gets_back_a_tracked_file_marked_skip_worktree_and_removed(tmp_path):
    repository, folder = worker_checkout(tmp_path)
    first = repository.tip("base")
    worktree = worktree_row(repository, folder, first)
    git = WorktreeGit(None, plain_executor())
    checkout = git.commit_checkout(worktree, first)
    repository.git("update-index", "--skip-worktree", "cart.py", folder=Path(checkout))
    Path(checkout, "cart.py").unlink()
    git.commit_checkout(worktree, first)
    assert Path(checkout, "cart.py").read_text() == "TOTAL = 0\n"
    assert repository.git("ls-files", "-v", folder=Path(checkout)).stdout.startswith("H cart.py")


def test_a_skipped_file_with_a_name_git_would_quote_is_brought_back_whole(tmp_path):
    repository, folder = worker_checkout(tmp_path)
    repository.committed("café notes.py", "NOTES = 1\n", "Notes with an accent")
    tip = repository.tip("base")
    worktree = worktree_row(repository, folder, tip)
    git = WorktreeGit(None, plain_executor())
    checkout = git.commit_checkout(worktree, tip)
    repository.git("update-index", "--skip-worktree", "café notes.py", folder=Path(checkout))
    Path(checkout, "café notes.py").unlink()
    git.restore_skipped_files(checkout)
    assert Path(checkout, "café notes.py").read_text() == "NOTES = 1\n"
