import fcntl
import os
import time
from collections.abc import Generator
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import IO
from core.base.journal_home import SERVER_SOCKET, JournalHome
from server.server_files_error import ServerFilesError


SOCKET_FILE_MODE = 0o600
LOCK_POLL_SECONDS = 0.05
def socket_path(home: JournalHome, name: str = SERVER_SOCKET) -> Path:
    return home.socket(name)
class ServerFiles:
    """The files a running server keeps in the journal's folder: its socket, owner-only; its lock, kept for
    the server's whole life or, for a while, by a helper; and its pid file. Only the server that keeps the
    lock removes a leftover socket, and a stopping server removes the socket and pid file only while the pid file
    still names it."""

    def __init__(self, home: JournalHome) -> None:
        self.socket = socket_path(home)
        self.lock = home.folder / "server.lock"
        self.pid_file = home.folder / "server.pid"
        self.log = home.folder / "runtime" / "server.log"
        self.lock_file: IO[str] | None = None

    def acquire_lock(self) -> bool:
        lock_file = self.lock.open("a")
        try:
            fcntl.flock(lock_file, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            lock_file.close()
            return False
        self.lock_file = lock_file
        return True

    def acquire_waiting(self, wait_seconds: float) -> bool:
        deadline = time.monotonic() + wait_seconds
        while not self.acquire_lock():
            if time.monotonic() >= deadline:
                return False
            time.sleep(LOCK_POLL_SECONDS)
        return True

    @contextmanager
    def locked(self, wait_seconds: float) -> Generator[None]:
        if not self.acquire_waiting(wait_seconds):
            raise ServerFilesError(f"the server lock {self.lock} was not free in {wait_seconds:g} seconds")
        try:
            yield
        finally:
            self.release_lock()

    def clear_leftover_socket(self) -> None:
        if self.lock_file is None:
            raise ServerFilesError("only the server that holds the lock removes a leftover socket")
        self.socket.unlink(missing_ok=True)

    def restrict_socket(self) -> None:
        os.chmod(self.socket, SOCKET_FILE_MODE)

    def write_pid(self) -> None:
        self.pid_file.write_text(str(os.getpid()))

    def remove_server_files(self) -> None:
        if self.pid_file.exists() and self.pid_file.read_text().strip() == str(os.getpid()):
            self.socket.unlink(missing_ok=True)
            self.pid_file.unlink(missing_ok=True)

    def log_line(self, text: str) -> None:
        self.log.parent.mkdir(parents=True, exist_ok=True)
        with self.log.open("a") as log:
            log.write(f"{datetime.now(timezone.utc).isoformat(timespec='seconds')} {text}\n")

    def release_lock(self) -> None:
        if self.lock_file is not None:
            self.lock_file.close()
            self.lock_file = None
