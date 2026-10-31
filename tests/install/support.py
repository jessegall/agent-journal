import fcntl
import os
import signal
import http.client
import socket
import sqlite3
import subprocess
import sys
import time
from pathlib import Path

from core.base.journal_home import JournalHome

INSTALL = Path(__file__).resolve().parents[2] / "install.sh"
TIMEOUT_SECONDS = 120
SERVER_EXIT_SECONDS = 20
SYSTEM_PATH = "/usr/bin:/bin"


class Scratch:
    """A scratch folder for one install test: an empty project, a home that is not the person's, an empty
    release to download from and a folder of programs for the install's PATH, so nothing runs in a consumer
    project and nothing touches the real ~/.claude."""

    def __init__(self, folder: Path) -> None:
        self.project, self.home, self.release, self.programs = folder / "project", folder / "home", folder / "release", folder / "programs"
        for made in (self.project, self.home, self.release, self.programs):
            made.mkdir()
        (self.programs / "python3").symlink_to(sys.executable)

    @property
    def journal(self) -> Path:
        return self.project / ".journal"

    def environment(self) -> dict[str, str]:
        return {"PATH": f"{self.programs}:{SYSTEM_PATH}", "HOME": str(self.home), "JOURNAL_RELEASE_URL": self.release.as_uri(),
                "JOURNAL_PLATFORM": "linux/amd64", "LANG": "C"}

    def install(self) -> subprocess.CompletedProcess[str]:
        return subprocess.run(["sh", str(INSTALL)], cwd=self.project, env=self.environment(), capture_output=True, text=True, timeout=TIMEOUT_SECONDS)

    def with_python(self, version: str) -> None:
        """Puts a python3 on the PATH that says it is an older version and refuses to run anything."""
        (self.programs / "python3").unlink()
        (self.programs / "python3").write_text(f'#!/bin/sh\n[ "$1" = "--version" ] && echo "Python {version}" && exit 0\nexit 1\n')
        (self.programs / "python3").chmod(0o755)

    def file_contents(self) -> dict[str, tuple[int, bytes]]:
        return {str(path.relative_to(self.project)): (path.stat().st_mtime_ns, path.read_bytes()) for path in sorted(self.project.rglob("*")) if path.is_file()}

    def tables(self, database: Path) -> set[str]:
        connection = sqlite3.connect(database)
        try:
            return {row[0] for row in connection.execute("SELECT name FROM sqlite_master WHERE type = 'table'")}
        finally:
            connection.close()




SERVER_SOURCE = INSTALL.parent / "src"
TOOLS_FOLDER = INSTALL.parent / "tools"


class ServerScratch:
    """A journal on a scratch home with the core's modules synced and, when asked, a real server: every wait and
    every process it starts is bounded, and the server is killed when the test ends."""

    def __init__(self, folder: Path) -> None:
        self.home = JournalHome(folder / "project" / ".journal")
        self.home.folder.mkdir(parents=True)
        self.processes: list[subprocess.Popen[str]] = []
        self.left_running: int | None = None
        self.sync()

    def environment(self) -> dict[str, str]:
        return {"PATH": f"{Path(sys.executable).parent}:{SYSTEM_PATH}", "JOURNAL_HOME": str(self.home.folder), "JOURNAL_SOURCE": str(SERVER_SOURCE),
                "JOURNAL_PYTHON": sys.executable, "HOME": str(self.home.folder.parent)}

    def sync(self) -> None:
        finished = subprocess.run([sys.executable, str(SERVER_SOURCE / "core" / "journal.py"), "module", "sync"], cwd=self.home.folder.parent,
                                  env=self.environment(), capture_output=True, text=True, timeout=TIMEOUT_SECONDS)
        assert finished.returncode == 0, finished.stdout + finished.stderr

    def start_server(self) -> subprocess.Popen[str]:
        process = subprocess.Popen([sys.executable, str(SERVER_SOURCE / "server" / "server.py"), "--home", str(self.home.folder)], cwd=self.home.folder.parent,
                                   env=self.environment(), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, text=True)
        self.processes.append(process)
        return process

    def healthy(self) -> bool:
        connection = UnixConnection(str(self.home.socket("server")))
        try:
            connection.request("GET", "/health")
            return connection.getresponse().status == 200
        except OSError:
            return False
        finally:
            connection.close()

    def wait_healthy(self, limit_seconds: float = 30) -> None:
        deadline = time.monotonic() + limit_seconds
        while not self.healthy():
            assert time.monotonic() < deadline, "the server did not answer"
            time.sleep(0.1)

    def stop_through(self, client: Path, limit_seconds: float = 60) -> None:
        """Stops the server a client started with the client's own stop, again while the server says it is still
        finishing its requests, until it lets the lock go."""
        deadline = time.monotonic() + limit_seconds
        while True:
            stopped = subprocess.run([str(client), "server", "stop"], env=self.environment(), capture_output=True, text=True, timeout=TIMEOUT_SECONDS)
            if stopped.returncode == 0 or time.monotonic() >= deadline:
                assert stopped.returncode == 0, (stopped.stdout, stopped.stderr)
                return
            time.sleep(1)

    def lock_is_free(self) -> bool:
        with (self.home.folder / "server.lock").open("a") as lock_file:
            try:
                fcntl.flock(lock_file, fcntl.LOCK_EX | fcntl.LOCK_NB)
            except BlockingIOError:
                return False
            return True

    def server_pid(self) -> int | None:
        pid_file = self.home.folder / "server.pid"
        return int(pid_file.read_text()) if pid_file.is_file() and pid_file.read_text().strip().isdigit() else None

    def is_running(self, pid: int) -> bool:
        try:
            os.kill(pid, 0)
        except ProcessLookupError:
            return False
        return not any(process.pid == pid and process.poll() is not None for process in self.processes)

    def close(self) -> None:
        """Ends every process the test started, and a server the Go client started on its own, by its pid; it
        returns the pid of a server that was left running, so the fixture can fail the test."""
        for process in self.processes:
            process.kill()
            process.wait(timeout=10)
        pid = self.server_pid()
        deadline = time.monotonic() + SERVER_EXIT_SECONDS
        while pid is not None and self.is_running(pid) and time.monotonic() < deadline:
            time.sleep(0.05)
        self.left_running = pid if pid is not None and self.is_running(pid) else None
        if self.left_running is not None:
            os.kill(self.left_running, signal.SIGKILL)


class UnixConnection(http.client.HTTPConnection):
    """An HTTP connection to a unix socket."""

    def __init__(self, path: str) -> None:
        super().__init__("journal", timeout=5)
        self.path = path

    def connect(self) -> None:
        self.sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        self.sock.settimeout(5)
        self.sock.connect(self.path)
