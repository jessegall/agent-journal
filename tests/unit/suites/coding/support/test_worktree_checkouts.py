from pathlib import Path

from engine.journal.journal_home import JournalHome
from suites.coding.support.worktree_checkouts import WORKTREES_FOLDER, WorktreeCheckouts


def test_the_worktree_folders_of_every_environment_are_the_projects_separate_checkouts(tmp_path: Path):
    home = JournalHome(tmp_path / "project" / ".journal")
    root = home.folder / WORKTREES_FOLDER.name
    worktrees = [root / "development" / "worker-2", root / "development-tests" / "run-1"]
    for worktree in worktrees:
        worktree.mkdir(parents=True)
    (root / "development" / "notes.txt").write_text("not a worktree")
    checkouts = WorktreeCheckouts(home)
    assert checkouts.folders() == tuple(sorted(worktree.resolve() for worktree in worktrees))
    assert checkouts.contains(worktrees[0]) and not checkouts.contains(home.project_folder)


def test_a_project_without_worktrees_has_no_separate_checkouts(tmp_path: Path):
    assert WorktreeCheckouts(JournalHome(tmp_path / "project" / ".journal")).folders() == ()
