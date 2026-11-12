import sqlite3
from pathlib import Path

from engine.journal.journal_home import JournalHome
from engine.time.timestamp import Timestamp

COPY_FOLDER = "backups-watch"


class FoldCopy:
    """Writes a whole copy of the journal's database with the backup API before a fold of main agents, named
    for its time, so a fold can be checked on it or undone from it."""

    @staticmethod
    def written(home: JournalHome, timestamp: Timestamp) -> Path:
        folder = home.folder / COPY_FOLDER
        folder.mkdir(parents=True, exist_ok=True)
        target = folder / f"fold-{timestamp.value.strftime('%Y%m%d-%H%M%S')}.db"
        source, copy = sqlite3.connect(home.database), sqlite3.connect(target)
        try:
            source.backup(copy)
        finally:
            copy.close()
            source.close()
        return target
