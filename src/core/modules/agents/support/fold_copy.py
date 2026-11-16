from engine.errors.refusal import Refusal
import sqlite3
from engine.file.file_access import FileAccess
from pathlib import Path

from engine.database.database import Database
from engine.journal.journal_home import JournalHome
from engine.time.timestamp import Timestamp

COPY_FOLDER = "backups-watch"
ATTEMPT_COPY = "fold-before.db"
UNFINISHED_SUFFIX = ".partial"
RENUMBER_COPY_PREFIX = "agents-before-renumber-"


class FoldCopy:
    """Writes a whole copy of the open database with the backup API before a fold of main agents, so a fold can
    be checked on it or undone from it. The copy before a fold at start is one file, replaced by each attempt,
    so a fold that fails at every start leaves one copy, not one per start. The copy before the renumber of
    agents is named agents-before-renumber-<time>.db, which the server's rotation of version-5-*.db copies
    never removes."""

    @staticmethod
    def folder(home: JournalHome) -> Path:
        folder = home.folder / COPY_FOLDER
        FileAccess.mkdir(folder, parents=True, exist_ok=True)
        return folder

    @classmethod
    def prepare_attempt(cls, database: Database, home: JournalHome) -> Path:
        target = cls.folder(home) / ATTEMPT_COPY
        unfinished = target.with_name(target.name + UNFINISHED_SUFFIX)
        FileAccess.unlink(unfinished, missing_ok=True)
        database.write_backup(unfinished)
        FileAccess.replace(unfinished, target)
        return target

    @classmethod
    def renumber_copy(cls, database: Database, home: JournalHome, timestamp: Timestamp) -> Path:
        target = cls.folder(home) / f"{RENUMBER_COPY_PREFIX}{timestamp.value.strftime('%Y%m%d-%H%M%S')}.db"
        unfinished = target.with_name(target.name + UNFINISHED_SUFFIX)
        try:
            FileAccess.unlink(unfinished, missing_ok=True)
            database.write_backup(unfinished)
            FileAccess.replace(unfinished, target)
        except (sqlite3.Error, OSError) as error:
            raise Refusal(f"could not copy the database before renumbering agents: {error}; free space and start again") from error
        return target
