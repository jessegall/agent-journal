from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.duration_at_least import DurationAtLeast


@dataclass(frozen=True)
class PartRunSeconds:
    """Matches process parts that ran at least this many seconds, from their start to their end."""

    seconds: int

    def statement(self) -> Statement:
        return DurationAtLeast("started_at", "ended_at", self.seconds).statement()
