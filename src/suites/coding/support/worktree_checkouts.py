from pathlib import Path

from engine.checkout.project_checkouts import ProjectCheckouts
from engine.journal.journal_home import JournalHome

WORKTREES_FOLDER = Path(".journal") / "worktrees"
WORKTREE_PATTERN = "*/*"


class WorktreeCheckouts(ProjectCheckouts):
    """The worktrees of the coding suite's workers, one folder per environment and worker under .journal/worktrees."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    @property
    def root(self) -> Path:
        return self.home.folder / WORKTREES_FOLDER.name

    def folders(self) -> tuple[Path, ...]:
        root = self.root
        return tuple(sorted(folder.resolve() for folder in root.glob(WORKTREE_PATTERN) if folder.is_dir())) if root.is_dir() else ()

    def holds(self, folder: Path) -> bool:
        return self.root.resolve() in folder.resolve().parents
