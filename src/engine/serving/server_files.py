import time
import fcntl
import os
from engine.serving.server_phase import ServerPhase
from collections.abc import Generator
from contextlib import ExitStack, contextmanager
from pathlib import Path
from typing import IO
from engine.time.clock import Clock
from engine.journal.journal_home import SERVER_SOCKET, JournalHome
from engine.file.file_access import FileAccess
from engine.enums.log_level import LogLevel
from engine.enums.log_source import LogSource
from engine.log.system_log_writer import LOG_LIMIT_BYTES, SystemLogWriter
from engine.hosting.server_restart_state import ServerRestartState
from engine.errors.server_files_error import ServerFilesError
from engine.time.polled_wait import PolledWait


SOCKET_FILE_MODE = 0o600
HOSTED_VIEWER_SOCKET = Path("/run/journal/viewer.sock")
LOCK_POLL_SECONDS = 0.05
MARK_FRESH_SECONDS = 120

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
        self.opened_lock = ExitStack()

    def acquire_lock(self) -> bool:
        opened = ExitStack()
        lock_file = opened.enter_context(FileAccess.shared().writer(self.lock, "a"))
        try:
            fcntl.flock(lock_file, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            opened.close()
            return False
        self.lock_file, self.opened_lock = lock_file, opened
        return True

    def keep_lock_descriptor(self, descriptor: int) -> None:
        self.lock_file = os.fdopen(descriptor, "a")

    def lock_descriptor(self) -> int:
        if self.lock_file is None:
            raise ServerFilesError("only the server that holds the lock hands it on")
        return self.lock_file.fileno()

    def acquire_waiting(self, wait_seconds: float) -> bool:
        return PolledWait(wait_seconds, LOCK_POLL_SECONDS).until(self.acquire_lock)

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
        FileAccess.shared().write(self.pid_file, str(os.getpid()))

    def remove_server_files(self) -> None:
        if self.pid_file.exists() and FileAccess.shared().read(self.pid_file).strip() == str(os.getpid()):
            self.socket.unlink(missing_ok=True)
            self.pid_file.unlink(missing_ok=True)

    # Moves a log past its limit aside as server.log.1, and points the output the starter opened on the
    # old file at the new one; only the server that holds the lock calls it.
    def rotate_log(self, limit_bytes: int = LOG_LIMIT_BYTES) -> None:
        self.system_log.rotate(limit_bytes)

    def log_line(self, text: str, level: LogLevel = LogLevel.INFORMATION) -> None:
        self.system_log.write(level, text, LogSource.SERVER)

    def write_tunnel_pid(self, pid: int) -> None:
        FileAccess.shared().write(self.tunnel_pid_file, str(pid))

    def tunnel_pid(self) -> int | None:
        text = FileAccess.shared().read(self.tunnel_pid_file).strip() if self.tunnel_pid_file.is_file() else ""
        return int(text) if text.isdigit() else None

    def clear_tunnel_pid(self) -> None:
        self.tunnel_pid_file.unlink(missing_ok=True)

    def phase(self) -> ServerPhase:
        if self.is_fresh(self.maintenance) or self.is_fresh(self.restart_mark):
            return ServerPhase.UPDATING
        if self.is_fresh(self.start_mark):
            return ServerPhase.STARTING
        return ServerPhase.READY

    @staticmethod
    def is_fresh(mark: Path) -> bool:
        try:
            return time.time() - mark.stat().st_mtime < MARK_FRESH_SECONDS
        except FileNotFoundError:
            return False

    def mark_maintenance(self) -> None:
        FileAccess.shared().write(self.maintenance, str(os.getpid()))

    def clear_maintenance(self) -> None:
        self.maintenance.unlink(missing_ok=True)

    def mark_restart(self) -> None:
        FileAccess.shared().write(self.restart_mark, str(os.getpid()))

    def clear_restart(self) -> None:
        self.restart_mark.unlink(missing_ok=True)
        self.start_mark.unlink(missing_ok=True)

    def mark_run_lock(self) -> None:
        FileAccess.shared().write(self.run_lock, str(os.getpid()))

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
            self.opened_lock.close()
            self.lock_file = None
