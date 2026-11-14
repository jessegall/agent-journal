from server.execution.round_tickets import RoundTickets
from server.execution.execution_round_yield import ExecutionRoundYield

from engine.time.clock import Clock
from engine.log.exception_sink import ExceptionSink
from engine.log.error_log import ErrorLog
from engine.log.system_log_writer import SystemLogWriter
from engine.journal.journal_home import JournalHome
from engine.listener.round_yield import RoundYield
from server.work.round_container import RoundContainer
from server.work.round_work import RoundWork


class JournalRound:
    """One round of a server thread on a journal: the thread's work run on the round's container, kept for the
    thread's life or fresh for a round that runs once; an error is reported under the thread's name. A round
    takes no ticket of its own: with round tickets each event its listeners handle waits for one."""

    def __init__(self, home: JournalHome, name: str, work: RoundWork, containers: RoundContainer, tickets: RoundTickets | None = None) -> None:
        self.home, self.name, self.work, self.containers = home, name, work, containers
        self.tickets = tickets

    def run(self) -> None:
        try:
            container = self.containers.round_container()
            if self.tickets is not None:
                container.bind(RoundYield, ExecutionRoundYield(self.tickets))
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
