from typing import ClassVar
from dataclasses import dataclass
from datetime import datetime

from journal.support.check_progress import CheckProgress
from journal.support.check_report import CheckReport
from journal.events.rows.check_completed import CheckCompleted
from journal.events.rows.row_resolved import RowResolved
from journal.models.model import Model


@dataclass(frozen=True)
class Check(Model):
    """A script that passes or fails about the project, run by hand or every so many minutes."""

    text_fields: ClassVar[tuple[str, ...]] = ("title", "brief", "command")
    title: str = ""
    brief: str = ""
    command: str = ""
    interval: float = 0
    last_passed: bool | None = None
    last_output: str = ""
    last_run_at: datetime | None = None
    last_duration: float = 0.0
    last_report: CheckReport | None = None
    progress: CheckProgress | None = None
    last_fault: str = ""
    wait_target: bool = False

    def edited(self, title: str, brief: str, command: str, interval_minutes: float) -> "Check":
        return self.with_(title=title, brief=brief, command=command, interval=interval_minutes)

    def started(self, time: float) -> "Check":
        return self.with_(progress=CheckProgress(time))

    def completed(self, passed: bool, output: str, time: datetime, elapsed: float, report: CheckReport | None, fault: str) -> "Check":
        executed = CheckCompleted(environment_id=0, time=time.timestamp(), check_id=self.id, title=self.title, passed=passed, output=output, prior_failure=self.last_passed is False, wait_target=self.wait_target)
        recorded = self.with_(last_passed=passed, last_output=output, last_run_at=time, last_duration=elapsed, last_report=report, progress=None, last_fault=fault).with_event(executed)
        if self.wait_target and passed and not self.is_resolved():
            return recorded.with_event(RowResolved(environment_id=0, time=time.timestamp(), ref=f"{self.table()}:{self.id}", outcome=recorded.outcome()))
        return recorded

    def needs_run(self, time: datetime) -> bool:
        if self.interval <= 0 or (self.wait_target and self.is_resolved()):
            return False
        return self.last_run_at is None or (time - self.last_run_at).total_seconds() >= self.interval * 60

    def is_resolved(self) -> bool:
        return self.last_passed is True

    def outcome(self) -> str:
        return f"check {self.id} passed"

    def cannot_run(self) -> bool:
        return bool(self.last_fault)

    def title_words(self) -> str:
        return self.title

    def summary_line(self) -> str:
        return self.first_line(self.brief)
