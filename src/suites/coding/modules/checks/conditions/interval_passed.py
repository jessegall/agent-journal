from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.elapsed_interval import ElapsedInterval
from engine.query.conditions.greater import Greater
from engine.query.conditions.conjunction import Conjunction


@dataclass(frozen=True)
class IntervalPassed:
    """Matches the checks that run on an interval and have never run, or whose interval has passed
    since they last ran."""

    present: str

    def statement(self) -> Statement:
        return Conjunction([Greater("interval_minutes", 0), ElapsedInterval("last_run_at", "interval_minutes", self.present)]).statement()
