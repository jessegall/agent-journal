from collections.abc import Generator
from contextlib import contextmanager

from engine.database.database import Database
from engine.journal.journal_home import JournalHome
from server.enums.queue_priority import QueuePriority
from server.hook.queue_request import QueueRequest
from server.hook.server_queue import RUNNING_HOOKS_COUNT, ServerQueue

CLOSE_WAIT_SECONDS = 60.0


class HookDatabase:
    """The database connections hooks use, one per running hook, with turns chosen by the server queue."""

    def __init__(self, home: JournalHome, running_hooks_count: int = RUNNING_HOOKS_COUNT) -> None:
        self.databases = [Database.shared(home) for _ in range(running_hooks_count)]
        self.free_databases = list(self.databases)
        self.queue = ServerQueue(running_hooks_count)

    @contextmanager
    def used(self, priority: QueuePriority, wait_seconds: float, owner: str = "", request: QueueRequest | None = None) -> Generator[Database]:
        with self.queue.hook_turn(priority, wait_seconds, owner, request):
            database = self.free_databases.pop()
            busy_timeout_seconds = database.busy_timeout_seconds()
            try:
                yield database
            finally:
                database.set_busy_timeout(busy_timeout_seconds)
                self.free_databases.append(database)

    def close(self) -> None:
        self.queue.wait_idle(CLOSE_WAIT_SECONDS)
        for database in self.databases:
            database.close()
