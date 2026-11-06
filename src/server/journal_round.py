from collections.abc import Callable
from contextlib import nullcontext

from core.base.container import Container
from core.base.exception_sink import ExceptionSink
from core.base.database.database import Database
from core.base.error_log import ErrorLog
from core.base.system_log_writer import SystemLogWriter
from core.base.journal_container import synced_container
from core.base.journal_home import JournalHome
from core.base.listener.round_yield import RoundYield
from server.hook.queue_round_yield import QueueRoundYield
from server.round_work import RoundWork
from server.hook.server_queue import ServerQueue
from server.hook.queue_request import QueueRequest


class JournalRound:
    """One round of a server thread on a journal: a fresh container, synced unless the round says
    otherwise, the thread's work run on it, its database closed; an error is reported under the thread's
    name. The queue inspector lists a running round, and a round takes no turn: no hook or CLI line
    waits behind one, and it waits behind none, but its listeners give way to the hooks that run or wait between the events they handle."""

    def __init__(self, home: JournalHome, name: str, work: RoundWork, container: Callable[[JournalHome], Container] = synced_container, queue: ServerQueue | None = None) -> None:
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
        ErrorLog(SystemLogWriter(self.home), ExceptionSink()).reported([self.name], error)
