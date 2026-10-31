import re
import shutil
import sqlite3
from dataclasses import dataclass
from pathlib import Path

from core.base.database.version_four_tables import VersionFourTables
from install.backup_mismatch import BackupMismatch

BACKUP_FOLDER = "version-4"
DATABASE = "journal.db"
VERSION_FILE = Path("src") / "journal" / "version.py"
VERSION_PATTERN = re.compile(r'VERSION\s*=\s*"([^"]+)"')
UNKNOWN_VERSION = "unknown"


@dataclass(frozen=True)
class BackupResult:
    """A backup of the version 4 database: where it is, how many tables it was checked on, and whether it was made
    now or an earlier upgrade's was kept."""

    path: Path
    tables: int
    kept: bool


class VersionFourBackup:
    """Copies a project's version 4 database with sqlite's backup interface, so one in WAL mode is consistent,
    into .journal/version-4/<version>/ with the version file of version 4's code beside it; opens the copy and
    compares the row counts of every table with the original's. A backup already made is never overwritten."""

    def __init__(self, journal: Path) -> None:
        self.journal = journal

    def version(self) -> str:
        file = self.journal / VERSION_FILE
        stated = VERSION_PATTERN.search(file.read_text()) if file.is_file() else None
        return stated.group(1) if stated else UNKNOWN_VERSION

    def make(self) -> BackupResult:
        folder = self.journal / BACKUP_FOLDER / self.version()
        target = folder / DATABASE
        if target.exists():
            return BackupResult(target, len(self.counts(target)), True)
        folder.mkdir(parents=True, exist_ok=True)
        self.copy(self.journal / DATABASE, target)
        if (self.journal / VERSION_FILE).is_file():
            shutil.copy(self.journal / VERSION_FILE, folder / VERSION_FILE.name)
        original, copy = self.counts(self.journal / DATABASE), self.counts(target)
        if original != copy:
            target.unlink()
            raise BackupMismatch(f"the copy of {self.journal / DATABASE} does not hold the rows the original does: {original} against {copy}")
        return BackupResult(target, len(copy), False)

    def copy(self, original: Path, target: Path) -> None:
        source = sqlite3.connect(f"{original.resolve().as_uri()}?mode=ro", uri=True)
        destination = sqlite3.connect(target)
        try:
            source.backup(destination)
        finally:
            destination.close()
            source.close()

    def counts(self, path: Path) -> dict[str, int]:
        connection = sqlite3.connect(f"{path.resolve().as_uri()}?mode=ro", uri=True)
        connection.row_factory = sqlite3.Row
        try:
            tables = VersionFourTables(connection)
            return {name: tables.count(name) for name in tables.names()}
        finally:
            connection.close()
