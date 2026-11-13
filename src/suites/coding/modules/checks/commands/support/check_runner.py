from collections.abc import Callable

from engine.enums.process_kind import ProcessKind
from engine.errors.run_time_limit_error import RunTimeLimitError
from engine.journal.journal_home import JournalHome
from engine.process.door.execution_request import ExecutionRequest
from engine.process.door.process_executor import ProcessExecutor
from suites.coding.modules.checks.commands.support.check_result import CheckResult

CHECK_LIMIT_SECONDS = 300


class CheckRunner:
    """Runs a check's command through the shell in the project's folder, through the one door under a time limit,
    hands on each line as it is printed and keeps what it printed."""

    def __init__(self, home: JournalHome, executor: ProcessExecutor, limit_seconds: float = CHECK_LIMIT_SECONDS) -> None:
        self.home, self.executor, self.limit_seconds = home, executor, limit_seconds

    def run(self, command: str, read_line: Callable[[str], None]) -> CheckResult:
        try:
            finished = self.executor.execute(ExecutionRequest(["sh", "-c", command], self.home.project_folder, ProcessKind.PLUGIN, self.limit_seconds, on_line=read_line))
        except RunTimeLimitError:
            return CheckResult(False, f"it did not end within {int(self.limit_seconds)} seconds")
        return CheckResult(finished.succeeded, finished.stdout.strip())
