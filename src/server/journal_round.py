from core.base.database.database import Database
from core.base.error_log import ErrorLog
from core.base.journal_container import synced_container
from core.base.journal_home import JournalHome
from server.round_work import RoundWork


class JournalRound:
    """One round of a server thread on a journal: a fresh synced container, the thread's work run on it, its database
    closed; an error is reported under the thread's name."""

    def __init__(self, home: JournalHome, name: str, work: RoundWork) -> None:
        self.home, self.name, self.work = home, name, work

    def run(self) -> None:
        container = synced_container(self.home)
        try:
            self.work.run(container)
        finally:
            container.get(Database).close()

    def report(self, error: Exception) -> None:
        ErrorLog(self.home).reported([self.name], error)
