from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.interval_passed_since import IntervalPassedSince
from engine.query.conditions.greater import Greater
from engine.query.conditions.all_of import AllOf


@dataclass(frozen=True)
class IntervalPassed:
    """Matches the checks that run on an interval and have never run, or whose interval has passed
    since they last ran."""

    present: str

    def statement(self) -> Statement:
        return AllOf([Greater("interval_minutes", 0), IntervalPassedSince("last_run_at", "interval_minutes", self.present)]).statement()
