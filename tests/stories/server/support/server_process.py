import os
import signal
import subprocess
import sys
import time
from pathlib import Path

from core.base.child_process import ChildProcess
from core.base.journal_home import JournalHome
from install.unix_connection import UnixConnection
from server.server_files import ServerFiles, socket_path
from tests.stories.server.support.server_client import request_answer

ROOT = Path(__file__).resolve().parents[4]
STOP_SECONDS = 2.0
TIMEOUT_SECONDS = 10
POLL_SECONDS = 0.05


class ServerProcess:
    """A real server process on a story's journal, for what only a process shows: its lock, its pid file and its
    stop on a signal. It is killed by its pid when the story ends, and every wait has a time limit."""

    def __init__(self, home: JournalHome) -> None:
        self.home, self.socket = home, socket_path(home)
        self.process: ChildProcess | None = None

    def __enter__(self) -> "ServerProcess":
        self.process = self.started()
        deadline = time.monotonic() + TIMEOUT_SECONDS
        while not self.socket.exists() and time.monotonic() < deadline:
            time.sleep(POLL_SECONDS)
        return self

    def __exit__(self, *details: object) -> None:
        if self.process is not None:
            self.process.stop(TIMEOUT_SECONDS)

    def started(self) -> ChildProcess:
        environment = {"PATH": os.environ.get("PATH", ""), "PYTHONPATH": str(ROOT / "src")}
        return ChildProcess(subprocess.Popen([sys.executable, str(ROOT / "src" / "server" / "server.py"), "--home", str(self.home.folder)], env=environment, text=True,
                                             stdout=subprocess.DEVNULL, stderr=subprocess.PIPE))

    def expect_health(self) -> None:
        answer = request_answer(self.socket, "GET", "/health")
        assert self.process is not None and answer.status == 200 and answer.json() == {**answer.json(), "pid": self.process.pid}, answer

    def expect_stop_on_sigterm(self) -> None:
        assert self.process is not None
        os.kill(self.process.pid, signal.SIGTERM)
        started = time.monotonic()
        assert self.process.wait(TIMEOUT_SECONDS) == 0
        assert time.monotonic() - started < STOP_SECONDS, "the server was slow to stop"
        files = ServerFiles(self.home)
        assert not self.socket.exists() and not files.pid_file.exists() and files.acquire_lock(), "the stopped server left its files"
        files.release_lock()

    def expect_stop_with_an_idle_connection(self) -> None:
        assert self.process is not None
        idle = UnixConnection(str(self.socket))
        try:
            idle.request("GET", "/health")
            idle.getresponse().read()
            assert request_answer(self.socket, "POST", "/stop", None).status == 200
            started = time.monotonic()
            assert self.process.wait(TIMEOUT_SECONDS) == 0
            assert time.monotonic() - started < STOP_SECONDS, "an idle connection held the stop"
        finally:
            idle.close()

    def expect_second_server_exits(self) -> None:
        second = self.started()
        assert second.wait(TIMEOUT_SECONDS) == 0
        self.expect_health()
