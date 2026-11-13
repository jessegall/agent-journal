from dataclasses import dataclass

from engine.database.statement import Statement


@dataclass(frozen=True)
class ElapsedInterval:
    """Matches rows whose interval in minutes, counted from their last time, has passed at the given instant; a row
    with no last time has passed."""

    last_column: str
    minutes_column: str
    instant: str

    def statement(self) -> Statement:
        return Statement(f"({self.last_column} IS NULL OR datetime({self.last_column}, '+' || {self.minutes_column} || ' minutes') <= datetime(?))", [self.instant])
