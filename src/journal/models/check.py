from dataclasses import dataclass
from datetime import datetime

from journal.models.check_progress import CheckProgress
from journal.models.check_report import CheckReport
from journal.models.model import Model


@dataclass(frozen=True)
class Check(Model):
    """A script that passes or fails about the project, run by hand or every so many minutes."""

    title: str = ""
    brief: str = ""
    """What it checks and what its failure means, in a few lines."""
    command: str = ""
    every: int = 0
    """Minutes between runs; 0 runs it only by hand."""
    last_passed: bool | None = None
    last_output: str = ""
    last_ran_at: datetime | None = None
    last_took: float = 0.0
    """Seconds the last run took, so the next run's bar can estimate before the check says how far it is."""
    last_report: CheckReport | None = None
    """What the last run wrote to its report file; None when it wrote none."""
    running: CheckProgress | None = None
    """The run under way; None while none runs."""
    last_fault: str = ""
    """Why the last run could not run its command at all, such as a missing program or a time-out; empty when it ran."""
    waited_on: bool = False
    """A check a blocked task waits on: off the lists and quiet in the chat; once it passes the task is open again and it runs no more."""

    def started(self, at: float) -> "Check":
        return self.with_(running=CheckProgress(at))

    def ran(self, passed: bool, output: str, at: datetime, took: float, report: CheckReport | None, fault: str) -> "Check":
        return self.with_(last_passed=passed, last_output=output, last_ran_at=at, last_took=took, last_report=report, running=None, last_fault=fault)

    def due_at(self, now: datetime) -> bool:
        if self.every <= 0 or (self.waited_on and self.is_settled()):
            return False
        return self.last_ran_at is None or (now - self.last_ran_at).total_seconds() >= self.every * 60

    def is_settled(self) -> bool:
        """Passed: what a task waiting on it waited for has come."""
        return self.last_passed is True

    def cannot_run(self) -> bool:
        return bool(self.last_fault)
