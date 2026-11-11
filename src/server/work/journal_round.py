from collections.abc import Callable
from contextlib import nullcontext

from engine.time.clock import Clock
from engine.container.container import Container
from engine.log.exception_sink import ExceptionSink
from engine.database.database import Database
from engine.log.error_log import ErrorLog
from engine.log.system_log_writer import SystemLogWriter
from engine.module.journal_container import synced_database_container
from engine.journal.journal_home import JournalHome
from engine.listener.round_yield import RoundYield
from server.hook.queue_round_yield import QueueRoundYield
from server.work.round_work import RoundWork
from server.hook.server_queue import ServerQueue
from server.hook.queue_request import QueueRequest

BACKGROUND_BUSY_TIMEOUT_SECONDS = 60.0


def background_container(home: JournalHome) -> Container:
    database = Database.opened(home)
    database.set_busy_timeout(BACKGROUND_BUSY_TIMEOUT_SECONDS)
    try:
        return synced_database_container(home, database)
    except BaseException:
        database.close()
        raise


class JournalRound:
    """One round of a server thread on a journal: a fresh container, synced unless the round says
    otherwise, the thread's work run on it, its database closed; an error is reported under the thread's
    name. The queue inspector lists a running round, and a round takes no turn: no hook or CLI line
    waits behind one, and it waits behind none, but its listeners pause for the hooks that run or wait between
    the events they handle."""

    def __init__(self, home: JournalHome, name: str, work: RoundWork, container: Callable[[JournalHome], Container] = background_container, queue: ServerQueue | None = None) -> None:
        self.home, self.name, self.work, self.container = home, name, work, container
        self.queue = queue

    def run(self) -> None:
        listed = self.queue.observing(QueueRequest.started("Background", self.name, priority="background")) if self.queue is not None else nullcontext()
        with listed:
            self.run_work()

    def run_work(self) -> None:
        container = self.container(self.home)
        try:
            if self.queue is not None:
                container.bind(RoundYield, QueueRoundYield(self.queue))
            self.work.run(container)
        finally:
            container.get(Database).close()

    def report(self, error: Exception) -> None:
        ErrorLog(SystemLogWriter(self.home, Clock()), ExceptionSink()).reported([self.name], error)
