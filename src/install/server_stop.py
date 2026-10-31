import time

from core.base.journal_home import JournalHome
from install.server_wont_stop_error import ServerWontStopError
from install.unix_connection import UnixConnection
from server.journal_server import DRAIN_LIMIT_SECONDS
from server.server_files import ServerFiles

SERVER_ABSENT = "no server running"
STOPPED = "the server stopped"
STOP_MARGIN_SECONDS = 5
POLL_SECONDS = 0.05


class ServerStop:
    """Asks the running server of a journal to stop and waits until it has drained and let the lock go; with no
    server running it says so and is not an error."""

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
        connection = UnixConnection(str(self.files.socket))
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
