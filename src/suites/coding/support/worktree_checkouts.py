from engine.file.file_access import FileAccess
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
        return tuple(sorted(folder.resolve() for folder in FileAccess.glob(root, WORKTREE_PATTERN) if FileAccess.is_dir(folder))) if FileAccess.is_dir(root) else ()

    def contains(self, folder: Path) -> bool:
        return self.root.resolve() in folder.resolve().parents
