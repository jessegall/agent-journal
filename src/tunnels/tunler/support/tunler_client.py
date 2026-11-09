import os
import shutil
import subprocess
from collections.abc import Mapping
from pathlib import Path

from core.base.child_process import ChildProcess
from core.base.journal_home import JournalHome
from core.base.leftover_process import LeftoverProcess
from engine.errors.refusal import Refusal
from core.base.tunnel.tunnel_state import TunnelState
from server.server_files import ServerFiles
from tunnels.tunler.support.tunler_answer import TunlerAnswer
from tunnels.tunler.support.tunler_installer import TunlerInstaller
from tunnels.tunler.support.tunler_login import TunlerLogin
from tunnels.tunler.support.tunler_report import TunlerReport
from tunnels.tunler.support.tunler_status import TunlerStatus
from tunnels.tunler.support.tunler_version import TunlerVersion

TUNLER_PATHS = (Path.home() / ".local" / "bin" / "tunler", Path.home() / "go" / "bin" / "tunler")
STATUS_LIMIT_SECONDS = 10
COMMAND_LIMIT_SECONDS = 30
CONNECTED_PREFIX = "tunnel up: "
PROGRAM_NAME = "tunler"


class TunlerClient:
    """Runs the tunler program on this machine: whether it is installed and logged in, started for a port
    under a
    subdomain with its lines in a log, its address from its own "tunnel up" line, stopped, and its login,
    domains
    and version. Whether it runs comes from the pid it left, so a read in another process sees it too."""

    def __init__(self, home: JournalHome) -> None:
        self.log = home.status_folder / "tunler.log"
        self.files = ServerFiles(home)
        self.process: ChildProcess | None = None

    def status(self) -> TunlerStatus:
        command = self.command()
        if command is None:
            return TunlerStatus(False, False)
        report = TunlerReport.parsed(self.answer(STATUS_LIMIT_SECONDS, {}, "status", "--json").text)
        return TunlerStatus(True, report.has_login and report.auth_accepted is True, report.user, report.host, command, report.has_login and report.auth_accepted is False)

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
        pid = self.files.tunnel_pid()
        self.files.clear_tunnel_pid()
        if pid is not None:
            LeftoverProcess.stop(pid, command)

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
        if self.process is not None:
            return self.process.running()
        pid = self.files.tunnel_pid()
        return pid is not None and PROGRAM_NAME in LeftoverProcess.command_line(pid)

    def log_lines(self) -> list[str]:
        return self.log.read_text(errors="replace").splitlines() if self.log.is_file() else []

    def login(self, host: str, username: str, password: str, master: str | None) -> TunlerLogin:
        answer = self.answer(COMMAND_LIMIT_SECONDS, self.login_environment(password, master), "login", username, f"--host={host}")
        if answer.succeeded:
            return TunlerLogin(True)
        lines = answer.text.splitlines() or ["tunler refused the login"]
        needs_master = "master password" in answer.text.lower() and master is None
        return TunlerLogin(False, needs_master, lines[0] if needs_master else lines[-1])

    def logout(self) -> None:
        answer = self.answer(COMMAND_LIMIT_SECONDS, {}, "logout")
        if not answer.succeeded:
            raise Refusal(answer.text or "tunler did not log out")
        command = self.command()
        if command is not None:
            self.stop_leftover(command)

    def domains(self) -> list[str]:
        answer = self.answer(COMMAND_LIMIT_SECONDS, {}, "domains")
        return [line.strip() for line in answer.text.splitlines() if line.strip()] if answer.succeeded else []

    def release(self, domain: str) -> None:
        answer = self.answer(COMMAND_LIMIT_SECONDS, {}, "release", domain.partition(".")[0])
        if not answer.succeeded:
            raise Refusal(answer.text or f"tunler did not release {domain}")

    def version(self) -> TunlerVersion:
        report = TunlerReport.parsed(self.answer(COMMAND_LIMIT_SECONDS, {}, "update", "--check", "--json").text)
        if report.update_available is not None:
            return TunlerVersion(report.current, report.latest, report.update_available)
        answer = self.answer(STATUS_LIMIT_SECONDS, {}, "version")
        return TunlerVersion(answer.text.split()[-1] if answer.succeeded and answer.text else None, None, False)

    def update(self) -> str:
        answer = self.answer(COMMAND_LIMIT_SECONDS, {}, "update")
        if not answer.succeeded:
            raise Refusal(answer.text or "tunler did not update")
        return answer.text.splitlines()[-1] if answer.text else "tunler is up to date"

    def install(self, host: str) -> str:
        return TunlerInstaller().install(host)

    def answer(self, limit_seconds: float, environment: Mapping[str, str], *arguments: str) -> TunlerAnswer:
        command = self.command()
        if command is None:
            return TunlerAnswer(False, "tunler is not installed on this machine")
        try:
            finished = subprocess.run([command, *arguments], capture_output=True, text=True, timeout=limit_seconds, stdin=subprocess.DEVNULL, env={**os.environ, **environment})
        except (OSError, subprocess.TimeoutExpired):
            return TunlerAnswer(False, f"tunler {arguments[0]} did not finish")
        return TunlerAnswer(finished.returncode == 0, (finished.stdout if finished.returncode == 0 else finished.stderr or finished.stdout).strip())

    @staticmethod
    def login_environment(password: str, master: str | None) -> Mapping[str, str]:
        return {name: value for name, value in (("TUNLER_PASSWORD", password), ("TUNLER_MASTER_PASSWORD", master)) if value is not None}

    @staticmethod
    def command() -> str | None:
        return shutil.which(PROGRAM_NAME) or next((str(path) for path in TUNLER_PATHS if path.is_file()), None)
