from types import TracebackType

from core.base.journal_home import JournalHome
from install.server_stop import ServerStop
from install.server_wont_stop_error import ServerWontStopError
from server.journal_server import DRAIN_LIMIT_SECONDS
from server.server_files import ServerFiles

__all__ = ["ServerLock", "ServerWontStopError"]

STOP_LIMIT_SECONDS = DRAIN_LIMIT_SECONDS + 5
LOCK_LIMIT_SECONDS = 60


class ServerLock:
    """Stops a journal's running server for a change of its code and keeps its server.lock while the change is
    made, so no server starts in the middle of it and two changes at once run in turn."""

    def __init__(self, home: JournalHome, stop_limit_seconds: float = STOP_LIMIT_SECONDS, lock_limit_seconds: float = LOCK_LIMIT_SECONDS) -> None:
        self.home, self.stop_limit_seconds, self.lock_limit_seconds = home, stop_limit_seconds, lock_limit_seconds
        self.files = ServerFiles(home)

    def __enter__(self) -> "ServerLock":
        ServerStop(self.home).stop(self.stop_limit_seconds)
        if not self.files.acquire_waiting(self.lock_limit_seconds):
            raise ServerWontStopError(f"the server lock was not free in {self.lock_limit_seconds:g} seconds")
        return self

    def __exit__(self, error_type: type[BaseException] | None, error: BaseException | None, trace: TracebackType | None) -> None:
        self.files.release_lock()
