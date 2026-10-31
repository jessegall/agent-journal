import fcntl
import hashlib
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import IO
from core.base.journal_home import JournalHome
from server.server_files_error import ServerFilesError


SOCKET_FILE_MODE = 0o600
SOCKET_PATH_LIMIT_CHARACTERS = 100
SHORT_SOCKET_FOLDER = Path("/tmp")
def socket_path(home: JournalHome) -> Path:
    path = home.folder.resolve() / "server.sock"
    if len(str(path)) <= SOCKET_PATH_LIMIT_CHARACTERS:
        return path
    return SHORT_SOCKET_FOLDER / f"journal-{hashlib.sha256(str(path).encode()).hexdigest()[:16]}.sock"
class ServerFiles:
    """The files a running server keeps in the journal's folder: its socket, owner-only; its lock, held for the
    server's whole life; and its pid file. Only the server that holds the lock removes a leftover socket, and
    a stopping server removes the socket and pid file only while the pid file still names it."""

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
