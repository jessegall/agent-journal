import json
import os
import shutil
import signal
import subprocess
import time
from pathlib import Path

from core.base.child_process import ChildProcess
from core.base.journal_home import JournalHome
from core.base.tunnel.tunnel_state import TunnelState
from server.server_files import ServerFiles
from tunnels.tunler.support.tunler_status import TunlerStatus

TUNLER_PATHS = (Path.home() / ".local" / "bin" / "tunler", Path.home() / "go" / "bin" / "tunler")
STATUS_LIMIT_SECONDS = 10
LEFTOVER_LIMIT_SECONDS = 5
POLL_SECONDS = 0.05
CONNECTED_PREFIX = "tunnel up: "


class TunlerClient:
    """Runs the tunler program on this machine: whether it is installed and logged in, started for a port under a
    subdomain with its lines in a log, its address from its own "tunnel up" line, and stopped."""

    def __init__(self, home: JournalHome) -> None:
        self.log = home.status_folder / "tunler.log"
        self.files = ServerFiles(home)
        self.process: ChildProcess | None = None

    def status(self) -> TunlerStatus:
        command = self.command()
        if command is None:
            return TunlerStatus(False, False)
        try:
            finished = subprocess.run([command, "status", "--json"], capture_output=True, text=True, timeout=STATUS_LIMIT_SECONDS, stdin=subprocess.DEVNULL)
            fields = json.loads(finished.stdout)
        except (subprocess.TimeoutExpired, ValueError):
            return TunlerStatus(True, False)
        return TunlerStatus(True, isinstance(fields, dict) and fields.get("logged_in") is True and fields.get("auth_ok") is True)

    def start(self, port: int, subdomain: str) -> None:
        command = self.command()
        if command is None:
            return
        self.stop_leftover(command)
        self.stop()
        self.log.parent.mkdir(parents=True, exist_ok=True)
        with self.log.open("wb") as log:
            self.process = ChildProcess(subprocess.Popen([command, str(port), f"--domain={subdomain}"], stdout=log, stderr=subprocess.STDOUT, stdin=subprocess.DEVNULL))
        self.files.write_tunnel_pid(self.process.pid)

    def stop_leftover(self, command: str) -> None:
        """Stops the tunler a server that was killed left running, found by the pid kept beside the server's, only when
        that pid still runs the tunler program."""
        pid = self.files.tunnel_pid()
        self.files.clear_tunnel_pid()
        if pid is None or command not in self.command_line(pid):
            return
        os.kill(pid, signal.SIGTERM)
        deadline = time.monotonic() + LEFTOVER_LIMIT_SECONDS
        while command in self.command_line(pid) and time.monotonic() < deadline:
            time.sleep(POLL_SECONDS)
        if command in self.command_line(pid):
            os.kill(pid, signal.SIGKILL)

    @staticmethod
    def command_line(pid: int) -> str:
        return subprocess.run(["ps", "-o", "command=", "-p", str(pid)], capture_output=True, text=True, check=False).stdout.strip()

    def state(self) -> TunnelState:
        if not self.running():
            return TunnelState.DISCONNECTED
        return TunnelState.CONNECTED if self.address() is not None else TunnelState.RECONNECTING

    def address(self) -> str | None:
        connection_lines = [text for text in self.log_lines() if CONNECTED_PREFIX in text]
        return connection_lines[-1].partition(CONNECTED_PREFIX)[2].partition(" ")[0] if connection_lines else None

    def last_line(self) -> str:
        log_lines = self.log_lines()
        return log_lines[-1].strip() if log_lines else ""

    def stop(self) -> None:
        if self.process is not None:
            self.process.stop(STATUS_LIMIT_SECONDS)
        self.process = None
        self.files.clear_tunnel_pid()

    def running(self) -> bool:
        return self.process is not None and self.process.running()

    def log_lines(self) -> list[str]:
        return self.log.read_text(errors="replace").splitlines() if self.log.is_file() else []

    @staticmethod
    def command() -> str | None:
        return shutil.which("tunler") or next((str(path) for path in TUNLER_PATHS if path.is_file()), None)
