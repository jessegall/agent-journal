from collections.abc import Generator
from contextlib import contextmanager

from core.base.database.database import Database
from core.base.journal_home import JournalHome
from server.hook.queue_priority import QueuePriority
from server.hook.server_queue import ServerQueue
from server.hook.queue_request import QueueRequest

CLOSE_WAIT_SECONDS = 60.0


class HookDatabase:
    """The one database connection the server's hooks share, kept open so its page cache stays warm; the
    server's queue decides whose turn it is, and one that waits past its limit is told so."""

    def __init__(self, home: JournalHome) -> None:
        self.database = Database.shared(home)
        self.queue = ServerQueue()

    @contextmanager
    def used(self, priority: QueuePriority, wait_seconds: float, request: QueueRequest | None = None) -> Generator[Database]:
        with self.queue.hook_turn(priority, wait_seconds, request):
            yield self.database

    def close(self) -> None:
        with self.queue.hook_turn(QueuePriority.MAIN_AGENT_HOOK, CLOSE_WAIT_SECONDS):
            self.database.close()
