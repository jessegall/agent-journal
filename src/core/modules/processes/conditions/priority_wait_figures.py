from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.select import Select

SECONDS_PER_DAY = 86400


@dataclass(frozen=True)
class PriorityWaitFigures:
    """For each first priority of the runs a select names: how many there are and their longest and average wait from
    entering to starting, in seconds."""

    select: Select

    def statement(self) -> Statement:
        source = self.select.statement()
        waited = f"max(0, (julianday(started_at) - julianday(created_at)) * {SECONDS_PER_DAY})"
        return Statement(f"SELECT first_priority, count(*) AS runs, max({waited}) AS longest, avg({waited}) AS average FROM ({source.sql}) GROUP BY first_priority",
                         tuple(source.parameters))
