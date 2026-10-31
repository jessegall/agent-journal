from contextlib import ExitStack
from types import TracebackType

from core.base.journal_home import JournalHome
from install.server_stop import ServerStop
from install.server_wont_stop_error import ServerWontStopError
from server.journal_server import DRAIN_LIMIT_SECONDS
from server.server_files import ServerFiles
from server.server_files_error import ServerFilesError

__all__ = ["ServerLock", "ServerWontStopError"]

STOP_LIMIT_SECONDS = DRAIN_LIMIT_SECONDS + 5
LOCK_LIMIT_SECONDS = 60


class ServerLock:
    """Stops a journal's running server for a change of its code and keeps its server.lock while the change is
    made, so no server starts in the middle of it and two changes at once run in turn. Its maintenance mark is
    there from before the stop to after the release, so no client starts a server in between."""

    def __init__(self, home: JournalHome, stop_limit_seconds: float = STOP_LIMIT_SECONDS, lock_limit_seconds: float = LOCK_LIMIT_SECONDS) -> None:
        self.home, self.stop_limit_seconds, self.lock_limit_seconds = home, stop_limit_seconds, lock_limit_seconds
        self.files = ServerFiles(home)
        self.held = ExitStack()

    def __enter__(self) -> "ServerLock":
        self.files.mark_maintenance()
        try:
            ServerStop(self.home).stop(self.stop_limit_seconds)
            self.held.enter_context(self.files.locked(self.lock_limit_seconds))
        except ServerFilesError as error:
            self.files.clear_maintenance()
            raise ServerWontStopError(str(error)) from error
        except BaseException:
            self.files.clear_maintenance()
            raise
        return self

    def __exit__(self, error_type: type[BaseException] | None, error: BaseException | None, trace: TracebackType | None) -> None:
        self.held.close()
        self.files.clear_maintenance()
