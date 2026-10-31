from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class JournalHome:
    """The folder where the journal keeps its files, and the paths inside it."""

    folder: Path

    @property
    def database(self) -> Path:
        return self.folder / "journal.db"

    @property
    def error_log(self) -> Path:
        return self.folder / "runtime" / "errors.log"
