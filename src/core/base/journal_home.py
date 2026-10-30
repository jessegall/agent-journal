from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class JournalHome:
    """The folder the journal keeps its own files in, and where each of them lives."""

    folder: Path

    @property
    def database(self) -> Path:
        return self.folder / "journal.db"

    @property
    def fault_log(self) -> Path:
        return self.folder / "runtime" / "faults.log"
