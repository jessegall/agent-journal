import time

from engine.journal.journal_home import JournalHome
from install.errors.server_wont_stop_error import ServerWontStopError
from engine.connection.unix_connection import UnixConnection
from core.base.serving.server_limits import DRAIN_LIMIT_SECONDS
from core.base.serving.server_files import ServerFiles
from engine.process.leftover_process import POLL_SECONDS

SERVER_ABSENT = "no server running"
STOPPED = "the server stopped"
STOP_MARGIN_SECONDS = 5


class ServerStop:
    """Asks the running server of a journal to stop and waits until it has drained and let the lock go; with
    no server running it says so and is not an error."""

    def __init__(self, home: JournalHome) -> None:
        self.files = ServerFiles(home)

    def stop(self, limit_seconds: float = DRAIN_LIMIT_SECONDS + STOP_MARGIN_SECONDS) -> str:
        if not self.posts_stop():
            return SERVER_ABSENT
        deadline = time.monotonic() + limit_seconds
        while not self.is_stopped():
            if time.monotonic() >= deadline:
                raise ServerWontStopError(f"the server did not stop in {limit_seconds:g} seconds")
            time.sleep(POLL_SECONDS)
        return STOPPED

    def posts_stop(self) -> bool:
        connection = UnixConnection(str(self.files.socket), 5, "journal")
        try:
            connection.request("POST", "/stop", body=b"{}", headers={"Content-Type": "application/json"})
            return connection.getresponse().status == 200
        except OSError:
            return False
        finally:
            connection.close()

    def is_stopped(self) -> bool:
        probe = ServerFiles(JournalHome(self.files.lock.parent))
        if not probe.acquire_lock():
            return False
        probe.release_lock()
        return True
