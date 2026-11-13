from engine.file.file_access import FileAccess
from pathlib import Path

DATABASE = "journal.db"
CODE_FOLDER = Path("src") / "journal"
ANSWER = "this project holds a version 4 journal: run journal upgrade"


class VersionFour:
    """A version 4 journal in a project's .journal folder: its journal.db and its code in src/journal."""

    def __init__(self, journal: Path) -> None:
        self.journal = journal

    def exists(self) -> bool:
        return FileAccess.exists(self.journal / DATABASE) or FileAccess.is_dir(self.journal / CODE_FOLDER)
