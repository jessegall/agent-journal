from pathlib import Path
import shutil
import sqlite3

from core.base.database.database import Database
from core.testing.story_journal import StoryJournal

LOG_ENDINGS = ("-wal", "-shm")


class WorkingJournal(StoryJournal):
    """One test runner's copy of a template, used by one story at a time. A story's writes stay in the database's
    write-ahead log, so a second connection or a real server sees them, and removing the log rolls the story
    back without copying the database. A checkpoint that reached the file makes it copy the template again."""

    def __init__(self, template: Path, file: Path) -> None:
        self.template, self.file = template, file
        self.is_taken = False
        self.restored()

    def restored(self) -> None:
        shutil.copyfile(self.template, self.file)
        self.file_state = self.current_file_state()

    def current_file_state(self) -> tuple[int, int]:
        status = self.file.stat()
        return status.st_mtime_ns, status.st_size

    def reserve(self) -> None:
        self.is_taken = True

    def defer_writes(self, database: Database) -> None:
        database.connection.execute("PRAGMA wal_autocheckpoint = 0")
        database.connection.setconfig(sqlite3.SQLITE_DBCONFIG_NO_CKPT_ON_CLOSE, True)

    def discard_writes(self) -> None:
        for ending in LOG_ENDINGS:
            Path(f"{self.file}{ending}").unlink(missing_ok=True)
        if self.current_file_state() != self.file_state:
            self.restored()
        self.is_taken = False
