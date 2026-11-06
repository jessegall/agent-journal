from collections.abc import Callable

from core.base.container import Container
from core.base.exception_sink import ExceptionSink
from core.base.database.database import Database
from core.base.error_log import ErrorLog
from core.base.system_log_writer import SystemLogWriter
from core.base.journal_container import synced_container
from core.base.journal_home import JournalHome
from server.round_work import RoundWork


class JournalRound:
    """One round of a server thread on a journal: a fresh container, synced unless the round says otherwise, the
    thread's work run on it, its database closed; an error is reported under the thread's name."""

    def __init__(self, home: JournalHome, name: str, work: RoundWork, container: Callable[[JournalHome], Container] = synced_container) -> None:
        self.home, self.name, self.work, self.container = home, name, work, container

    def run(self) -> None:
        container = self.container(self.home)
        try:
            self.work.run(container)
        finally:
            container.get(Database).close()

    def report(self, error: Exception) -> None:
        ErrorLog(SystemLogWriter(self.home), ExceptionSink()).reported([self.name], error)
