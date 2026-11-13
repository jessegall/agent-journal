from contextlib import nullcontext

from engine.time.clock import Clock
from engine.log.exception_sink import ExceptionSink
from engine.log.error_log import ErrorLog
from engine.log.system_log_writer import SystemLogWriter
from engine.journal.journal_home import JournalHome
from engine.listener.round_yield import RoundYield
from server.hook.queue_round_yield import QueueRoundYield
from server.work.fresh_round_container import FreshRoundContainer
from server.work.kept_round_container import KeptRoundContainer
from server.work.round_work import RoundWork
from server.hook.server_queue import ServerQueue
from server.hook.queue_request import QueueRequest


class JournalRound:
    """One round of a server thread on a journal: the thread's work run on the round's container, kept for the
    thread's life or fresh for a round that runs once; an error is reported under the thread's name. The queue
    inspector lists a running round, and a round takes no turn: no hook or CLI line waits behind one, and it
    waits behind none, but its listeners pause for the hooks that run or wait between the events they handle."""

    def __init__(self, home: JournalHome, name: str, work: RoundWork, containers: KeptRoundContainer | FreshRoundContainer, queue: ServerQueue | None = None) -> None:
        self.home, self.name, self.work, self.containers = home, name, work, containers
        self.queue = queue

    def run(self) -> None:
        listed = self.queue.observing(QueueRequest.started("Background", self.name, priority="background")) if self.queue is not None else nullcontext()
        with listed:
            self.run_work()

    def run_work(self) -> None:
        container = self.containers.round_container()
        if self.queue is not None:
            container.bind(RoundYield, QueueRoundYield(self.queue))
        try:
            self.work.run(container)
        except Exception as error:
            self.containers.failed(error, self.name)
            raise
        finally:
            self.containers.ended_round(self.name)

    def close(self) -> None:
        self.containers.close()

    def report(self, error: Exception) -> None:
        ErrorLog(SystemLogWriter(self.home, Clock()), ExceptionSink()).reported([self.name], error)
