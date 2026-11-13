import re
import shutil
import sqlite3
from pathlib import Path

from engine.database.version_four_tables import VersionFourTables
from engine.file.file_access import FileAccess
from install.errors.backup_mismatch_error import BackupMismatchError
from install.errors.backup_write_error import BackupWriteError
from install.backup.backup_result import BackupResult

BACKUP_FOLDER = "version-4"
DATABASE = "journal.db"
VERSION_FILE = Path("src") / "journal" / "version.py"
VERSION_PATTERN = re.compile(r'VERSION\s*=\s*"([^"]+)"')
UNKNOWN_VERSION = "unknown"


class VersionFourBackup:
    """Copies a project's version 4 database with sqlite's backup interface, so one in WAL mode is consistent,
    into .journal/version-4/<version>/ with the version file of version 4's code beside it; opens the copy and
    compares the row counts of every table with the original's. A backup already made is never overwritten."""

    def __init__(self, journal: Path) -> None:
        self.journal = journal

    def version(self) -> str:
        file = self.journal / VERSION_FILE
        stated = VERSION_PATTERN.search(FileAccess.read(file)) if FileAccess.is_file(file) else None
        return stated.group(1) if stated else UNKNOWN_VERSION

    def make(self) -> BackupResult:
        folder = self.journal / BACKUP_FOLDER / self.version()
        target = folder / DATABASE
        if FileAccess.exists(target):
            return BackupResult(target, len(self.counts(target)), True)
        FileAccess.mkdir(folder, parents=True, exist_ok=True)
        partial = folder / f"{DATABASE}.partial"
        try:
            self.copy(self.journal / DATABASE, partial)
            FileAccess.replace(partial, target)
        except OSError as error:
            FileAccess.unlink(partial, missing_ok=True)
            raise BackupWriteError(f"the backup of {self.journal / DATABASE} could not be made: {error}; nothing was changed") from error
        if FileAccess.is_file(self.journal / VERSION_FILE):
            FileAccess.copy(self.journal / VERSION_FILE, folder / VERSION_FILE.name)
        original, copy = self.counts(self.journal / DATABASE), self.counts(target)
        if original != copy:
            FileAccess.unlink(target)
            raise BackupMismatchError(f"the copy of {self.journal / DATABASE} does not hold the rows the original does: {original} against {copy}")
        return BackupResult(target, len(copy), False)

    def copy(self, original: Path, target: Path) -> None:
        if not FileAccess.exists(original.parent / f"{DATABASE}-wal"):
            FileAccess.copy(original, target)
            return
        source = sqlite3.connect(f"{original.resolve().as_uri()}?mode=ro", uri=True)
        destination = sqlite3.connect(target)
        try:
            source.backup(destination)
        finally:
            destination.close()
            source.close()

    def latest(self) -> Path | None:
        backups = sorted(FileAccess.glob(self.journal / BACKUP_FOLDER, f"*/{DATABASE}"), key=lambda path: FileAccess.stat(path).st_mtime)
        return backups[-1] if backups else None

    def counts(self, path: Path) -> dict[str, int]:
        connection = sqlite3.connect(f"{path.resolve().as_uri()}?mode=ro", uri=True)
        connection.row_factory = sqlite3.Row
        try:
            tables = VersionFourTables(connection)
            return {name: tables.count(name) for name in tables.names()}
        finally:
            connection.close()
