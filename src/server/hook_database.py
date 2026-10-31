import threading
from collections.abc import Generator
from contextlib import contextmanager

from core.base.database.database import Database
from core.base.journal_home import JournalHome


class HookDatabase:
    """The one database connection the server's hooks share, kept open so its page cache stays warm; one hook uses
    it at a time, as hooks are write transactions SQLite runs one at a time anyway."""

    def __init__(self, home: JournalHome) -> None:
        self.database = Database.shared(home)
        self.lock = threading.Lock()

    @contextmanager
    def used(self) -> Generator[Database]:
        with self.lock:
            yield self.database

    def close(self) -> None:
        with self.lock:
            self.database.close()
