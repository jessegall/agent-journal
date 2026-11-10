from dataclasses import dataclass

from engine.database.statement import Statement


@dataclass(frozen=True)
class IntervalPassed:
    """Matches the checks that run on an interval and have never run, or whose interval has passed
    since they last ran."""

    present: str

    def statement(self) -> Statement:
        return Statement("interval_minutes > 0 AND (last_run_at IS NULL OR datetime(last_run_at, '+' || interval_minutes || ' minutes') <= datetime(?))", [self.present])
