from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.minimum_duration import MinimumDuration


@dataclass(frozen=True)
class PartRunSeconds:
    """Matches process parts that ran at least this many seconds, from their start to their end."""

    seconds: int

    def statement(self) -> Statement:
        return MinimumDuration("started_at", "ended_at", self.seconds).statement()
