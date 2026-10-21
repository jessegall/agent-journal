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
    every: float = 0
    last_passed: bool | None = None
    last_output: str = ""
    last_ran_at: datetime | None = None
    last_took: float = 0.0
    last_report: CheckReport | None = None
    running: CheckProgress | None = None
    last_fault: str = ""
    waited_on: bool = False

    def edited(self, title: str, brief: str, command: str, interval_minutes: float) -> "Check":
        return self.with_(title=title, brief=brief, command=command, every=interval_minutes)

    def started(self, time: float) -> "Check":
        return self.with_(running=CheckProgress(time))

    def ran(self, passed: bool, output: str, time: datetime, took: float, report: CheckReport | None, fault: str) -> "Check":
        ran = CheckCompleted(environment_id=0, time=time.timestamp(), check_id=self.id, title=self.title, passed=passed, output=output, failed_before=self.last_passed is False, waited_on=self.waited_on)
        recorded = self.with_(last_passed=passed, last_output=output, last_ran_at=time, last_took=took, last_report=report, running=None, last_fault=fault).with_event(ran)
        if self.waited_on and passed and not self.is_settled():
            return recorded.with_event(RowResolved(environment_id=0, time=time.timestamp(), ref=f"{self.table()}:{self.id}", outcome=recorded.came_to()))
        return recorded

    def due_at(self, time: datetime) -> bool:
        if self.every <= 0 or (self.waited_on and self.is_settled()):
            return False
        return self.last_ran_at is None or (time - self.last_ran_at).total_seconds() >= self.every * 60

    def is_settled(self) -> bool:
        return self.last_passed is True

    def came_to(self) -> str:
        return f"check {self.id} passed"

    def cannot_run(self) -> bool:
        return bool(self.last_fault)

    def title_words(self) -> str:
        return self.title

    def summary_line(self) -> str:
        return self.first_line(self.brief)
