import os
import signal
import subprocess
import threading
from collections.abc import Callable

from core.base.journal_home import JournalHome
from suites.coding.modules.checks.commands.support.check_result import CheckResult

CHECK_LIMIT_SECONDS = 300


class CheckRunner:
    """Runs a check's command through the shell in the project's folder, under a time limit, hands on each line
    as it is printed and keeps what it printed."""

    def __init__(self, home: JournalHome, limit_seconds: float = CHECK_LIMIT_SECONDS) -> None:
        self.home, self.limit_seconds = home, limit_seconds

    def run(self, command: str, read_line: Callable[[str], None]) -> CheckResult:
        running = subprocess.Popen(["sh", "-c", command], cwd=self.home.project_folder, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, errors="replace", start_new_session=True)
        expired = threading.Event()
        limit = threading.Timer(self.limit_seconds, self.stopped, [running, expired])
        limit.start()
        lines: list[str] = []
        try:
            for line in running.stdout or ():
                lines.append(line)
                read_line(line)
            running.wait()
        finally:
            limit.cancel()
        if expired.is_set():
            return CheckResult(False, f"it did not end within {int(self.limit_seconds)} seconds")
        return CheckResult(running.returncode == 0, "".join(lines).strip())

    @staticmethod
    def stopped(running: subprocess.Popen[str], expired: threading.Event) -> None:
        expired.set()
        os.killpg(running.pid, signal.SIGKILL)
