import logging
import sqlite3

from core.base.database.database import Database
from core.base.journal_container import synced_database_container
from core.base.journal_home import JournalHome
from core.modules.developer.support.hook_request_log import HookRequestLog
from core.modules.drivers.models.enums.hook_answer import HookAnswer


class RequestLog:
    """Records requests without waiting for a database writer."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home

    def record(self, line: list[str], role: str, duration_ms: float, queued_ms: float, code: int) -> None:
        if role == "viewer" and line[:2] == ["developer", "hook-requests"]:
            return
        try:
            connection = sqlite3.connect(self.home.database, timeout=0, autocommit=True)
            connection.row_factory = sqlite3.Row
            database = Database(connection, str(self.home.database))
            try:
                container = synced_database_container(self.home, database)
                outcome = HookAnswer.ALLOWED if code == 0 else HookAnswer.REFUSED
                container.get(HookRequestLog).record("", {}, {"event": " ".join(line)}, duration_ms, outcome, queued_ms, role)
            finally:
                database.close()
        except sqlite3.Error as error:
            logging.getLogger(__name__).warning("request recording failed: %s", error)
