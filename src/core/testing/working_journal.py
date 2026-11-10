import gc
import os
from pathlib import Path
import shutil
import sqlite3

from engine.database.database import Database
from core.testing.story_journal import StoryJournal

LOG_ENDINGS = ("-wal", "-shm")
DESCRIPTOR_FOLDER = "/dev/fd"


class WorkingJournal(StoryJournal):
    """One test runner's copy of a template, used by one story at a time. A story's writes stay in the database's
    write-ahead log, so a second connection or a real server sees them, and removing the log rolls the story
    back without copying the database. A checkpoint that reached the file makes it copy the template again. A
    connection still open when the story ends would share its removed log with the next story, so the file is
    then replaced by a new copy and that connection keeps the old one."""

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
        is_abandoned = self.has_open_connection()
        for ending in LOG_ENDINGS:
            Path(f"{self.file}{ending}").unlink(missing_ok=True)
        if is_abandoned:
            self.file.unlink()
        if is_abandoned or self.current_file_state() != self.file_state:
            self.restored()
        self.is_taken = False

    def has_open_connection(self) -> bool:
        if not self.is_file_open():
            return False
        gc.collect()
        return self.is_file_open()

    def is_file_open(self) -> bool:
        file_status = self.file.stat()
        descriptors = [name for name in os.listdir(DESCRIPTOR_FOLDER) if os.path.exists(f"{DESCRIPTOR_FOLDER}/{name}")]
        return any(os.path.samestat(os.fstat(int(name)), file_status) for name in descriptors)
