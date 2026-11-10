from contextlib import ExitStack
from types import TracebackType

from core.base.journal_home import JournalHome
from install.run_drain import RunDrain
from install.server_stop import ServerStop
from install.server_wont_stop_error import ServerWontStopError
from core.base.serving.server_limits import DRAIN_LIMIT_SECONDS
from core.base.serving.server_files import ServerFiles
from engine.errors.server_files_error import ServerFilesError

__all__ = ["ServerLock", "ServerWontStopError"]

STOP_LIMIT_SECONDS = DRAIN_LIMIT_SECONDS + 5
LOCK_LIMIT_SECONDS = 60


class ServerLock:
    """Waits until no run is going, stops a journal's running server for a change of its code and keeps its
    server.lock while the change is made, so no run is cut short, no server starts in the middle of it and two
    changes at once run in turn. New runs wait on the run lock until the change is done. Its maintenance mark
    is there from before the stop to after the release, so no client starts a server in between. Its restart
    mark makes hooks wait until the next server takes requests, which removes it."""

    def __init__(self, home: JournalHome, stop_limit_seconds: float = STOP_LIMIT_SECONDS, lock_limit_seconds: float = LOCK_LIMIT_SECONDS) -> None:
        self.home, self.stop_limit_seconds, self.lock_limit_seconds = home, stop_limit_seconds, lock_limit_seconds
        self.files = ServerFiles(home)
        self.held = ExitStack()

    def __enter__(self) -> "ServerLock":
        RunDrain(self.home).wait()
        self.files.mark_maintenance()
        self.files.mark_restart()
        try:
            ServerStop(self.home).stop(self.stop_limit_seconds)
            self.held.enter_context(self.files.locked(self.lock_limit_seconds))
        except ServerFilesError as error:
            self.clear_marks()
            self.files.clear_restart()
            raise ServerWontStopError(str(error)) from error
        except BaseException:
            self.clear_marks()
            self.files.clear_restart()
            raise
        return self

    def __exit__(self, error_type: type[BaseException] | None, error: BaseException | None, trace: TracebackType | None) -> None:
        self.held.close()
        self.clear_marks()

    def clear_marks(self) -> None:
        self.files.clear_maintenance()
        self.files.clear_run_lock()
