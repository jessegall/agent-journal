import shutil
from pathlib import Path

from core.base.journal_home import JournalHome
from core.base.conflict_files import ConflictFiles

IGNORED = ("__pycache__", "node_modules", "*.pyc", ".venv")


class CodeCopy:
    """The journal's code copied into a home's own src folder, so a running journal keeps its code while the
    source it came from changes."""

    def __init__(self, source: Path, home: JournalHome) -> None:
        self.source, self.home = source, home

    def folder(self) -> Path:
        return self.home.folder / "src"

    def make(self) -> None:
        self.write(self.folder())

    def write(self, folder: Path) -> None:
        ConflictFiles(self.source).check()
        shutil.copytree(self.source, folder, ignore=shutil.ignore_patterns(*IGNORED), dirs_exist_ok=True)
