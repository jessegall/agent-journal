from collections.abc import Generator
from contextlib import contextmanager

from core.base.database.database import Database
from core.base.journal_home import JournalHome
from server.hook.queue_priority import QueuePriority
from server.hook.server_queue import RUNNING_HOOKS_COUNT, ServerQueue

CLOSE_WAIT_SECONDS = 60.0


class HookDatabase:
    """The database connections the server's hooks use, one per running hook, kept open so their page caches stay
    warm; the server's queue decides whose turn it is, and one that waits past its limit is told so."""

    def __init__(self, home: JournalHome, running_hooks_count: int = RUNNING_HOOKS_COUNT) -> None:
        self.databases = [Database.shared(home) for _ in range(running_hooks_count)]
        self.free_databases = list(self.databases)
        self.queue = ServerQueue(running_hooks_count)

    @contextmanager
    def used(self, priority: QueuePriority, wait_seconds: float, owner: str = "") -> Generator[Database]:
        with self.queue.hook_turn(priority, wait_seconds, owner):
            database = self.free_databases.pop()
            try:
                yield database
            finally:
                self.free_databases.append(database)

    def close(self) -> None:
        self.queue.wait_until_idle(CLOSE_WAIT_SECONDS)
        for database in self.databases:
            database.close()
