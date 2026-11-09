import fcntl
import os
import time
from collections.abc import Generator
from contextlib import contextmanager
from pathlib import Path
from typing import IO
from core.base.clock import Clock
from core.base.journal_home import SERVER_SOCKET, JournalHome
from core.base.file_access import FileAccess
from core.base.log_level import LogLevel
from core.base.log_source import LogSource
from core.base.system_log_writer import LOG_LIMIT_BYTES, SystemLogWriter
from core.base.server_restart_state import ServerRestartState
from server.server_files_error import ServerFilesError


SOCKET_FILE_MODE = 0o600
HOSTED_VIEWER_SOCKET = Path("/run/journal/viewer.sock")
LOCK_POLL_SECONDS = 0.05
def socket_path(home: JournalHome, name: str = SERVER_SOCKET) -> Path:
    return home.socket(name)
class ServerFiles:
    """The files a running server keeps in the journal's folder: its socket, owner-only; its lock, kept for
    the server's whole life or, for a while, by a helper; its pid file and the pid of the tunnel program it
    started; the maintenance mark a change of the code keeps while the server is stopped, which tells a
    client to start none; and the restart mark from a stop for new code until the next server takes
    requests, which makes a hook wait; and its log, which a start past the limit moves aside, keeping one
    old file. Only the server that keeps the lock removes a leftover socket, and a stopping server removes
    the socket and pid file only while the pid file still names it."""

    def __init__(self, home: JournalHome) -> None:
        self.socket = socket_path(home)
        self.viewer_socket = HOSTED_VIEWER_SOCKET
        self.lock = home.folder / "server.lock"
        self.pid_file = home.folder / "server.pid"
        self.log = home.system_log
        self.system_log = SystemLogWriter(home, Clock())
        self.maintenance = home.folder / "maintenance"
        self.run_lock = home.run_lock
        self.restart_mark = home.restart_mark
        self.start_mark = home.folder / "server-starting"
        self.tunnel_pid_file = home.folder / "tunnel.pid"
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

    def keep_lock_descriptor(self, descriptor: int) -> None:
        self.lock_file = os.fdopen(descriptor, "a")

    def lock_descriptor(self) -> int:
        if self.lock_file is None:
            raise ServerFilesError("only the server that holds the lock hands it on")
        return self.lock_file.fileno()

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

    # Moves a log past its limit aside as server.log.1, and points the output the starter opened on the
    # old file at the new one; only the server that holds the lock calls it.
    def rotate_log(self, limit_bytes: int = LOG_LIMIT_BYTES) -> None:
        self.system_log.rotate(limit_bytes)

    def log_line(self, text: str, level: LogLevel = LogLevel.INFORMATION) -> None:
        self.system_log.write(level, text, LogSource.SERVER)

    def write_tunnel_pid(self, pid: int) -> None:
        self.tunnel_pid_file.write_text(str(pid))

    def tunnel_pid(self) -> int | None:
        text = self.tunnel_pid_file.read_text().strip() if self.tunnel_pid_file.is_file() else ""
        return int(text) if text.isdigit() else None

    def clear_tunnel_pid(self) -> None:
        self.tunnel_pid_file.unlink(missing_ok=True)

    def mark_maintenance(self) -> None:
        self.maintenance.write_text(str(os.getpid()))

    def clear_maintenance(self) -> None:
        self.maintenance.unlink(missing_ok=True)

    def mark_restart(self) -> None:
        self.restart_mark.write_text(str(os.getpid()))

    def clear_restart(self) -> None:
        self.restart_mark.unlink(missing_ok=True)
        self.start_mark.unlink(missing_ok=True)

    def mark_run_lock(self) -> None:
        self.run_lock.write_text(str(os.getpid()))

    def clear_run_lock(self) -> None:
        self.run_lock.unlink(missing_ok=True)

    def clear_dead_run_lock(self) -> None:
        if not self.run_lock.is_file():
            return
        text = FileAccess.shared().read(self.run_lock).strip()
        if not (text.isdigit() and ServerRestartState.is_running(text)):
            self.clear_run_lock()

    def release_lock(self) -> None:
        if self.lock_file is not None:
            self.lock_file.close()
            self.lock_file = None
