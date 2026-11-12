import subprocess
import threading
from collections.abc import Callable

from engine.journal.journal_home import JournalHome
from suites.coding.modules.checks.commands.support.check_group import CheckGroup
from suites.coding.modules.checks.commands.support.check_result import CheckResult

CHECK_LIMIT_SECONDS = 300


class CheckRunner:
    """Runs a check's command through the shell in the project's folder, under a time limit, hands on each line
    as it is printed and keeps what it printed. A reader of the lines that fails stops the check's whole process
    group, and a check that ended in time is never reported as late."""

    def __init__(self, home: JournalHome, limit_seconds: float = CHECK_LIMIT_SECONDS) -> None:
        self.home, self.limit_seconds = home, limit_seconds

    def run(self, command: str, read_line: Callable[[str], None]) -> CheckResult:
        running = subprocess.Popen(["sh", "-c", command], cwd=self.home.project_folder, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, errors="replace", start_new_session=True)
        group = CheckGroup(running)
        limit = threading.Timer(self.limit_seconds, group.expire)
        limit.start()
        lines: list[str] = []
        try:
            for line in running.stdout or ():
                lines.append(line)
                read_line(line)
            running.wait()
        except BaseException:
            group.stop()
            raise
        finally:
            limit.cancel()
            group.finish()
        if group.expired:
            return CheckResult(False, f"it did not end within {int(self.limit_seconds)} seconds")
        return CheckResult(running.returncode == 0, "".join(lines).strip())
