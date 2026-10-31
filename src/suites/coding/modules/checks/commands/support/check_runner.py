import subprocess

from core.base.journal_home import JournalHome
from suites.coding.modules.checks.commands.support.check_result import CheckResult

CHECK_LIMIT_SECONDS = 300


class CheckRunner:
    """Runs a check's command through the shell in the project's folder, under a time limit, and keeps what it
    printed."""

    def __init__(self, home: JournalHome, limit_seconds: float = CHECK_LIMIT_SECONDS) -> None:
        self.home, self.limit_seconds = home, limit_seconds

    def run(self, command: str) -> CheckResult:
        try:
            finished = subprocess.run(["sh", "-c", command], cwd=self.home.project_folder, capture_output=True, text=True, timeout=self.limit_seconds, check=False)
        except subprocess.TimeoutExpired:
            return CheckResult(False, f"it did not end within {int(self.limit_seconds)} seconds")
        return CheckResult(finished.returncode == 0, (finished.stdout + finished.stderr).strip())
