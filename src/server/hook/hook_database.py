import threading
from collections.abc import Generator
from contextlib import contextmanager

from core.base.database.database import Database
from core.base.journal_home import JournalHome
from server.hook.hook_database_busy_error import HookDatabaseBusyError


class HookDatabase:
    """The one database connection the server's hooks share, kept open so its page cache stays warm; one hook
    uses it at a time, as hooks are write transactions SQLite runs one at a time anyway, and one that waits
    past its limit for another is told so."""

    def __init__(self, home: JournalHome) -> None:
        self.database = Database.shared(home)
        self.lock = threading.Lock()

    @contextmanager
    def used(self, wait_seconds: float) -> Generator[Database]:
        if not self.lock.acquire(timeout=wait_seconds):
            raise HookDatabaseBusyError(f"another hook held the journal for {wait_seconds:g} seconds")
        try:
            yield self.database
        finally:
            self.lock.release()

    def close(self) -> None:
        with self.lock:
            self.database.close()
