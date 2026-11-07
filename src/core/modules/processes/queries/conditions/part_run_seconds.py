from dataclasses import dataclass

from core.base.database.statement import Statement


@dataclass(frozen=True)
class PartRunSeconds:
    """Matches process parts that ran at least this many seconds, from their start to their end."""

    seconds: int

    def statement(self) -> Statement:
        return Statement("started_at > '' AND ended_at > '' AND (julianday(ended_at) - julianday(started_at)) * 86400 >= ?", [self.seconds])
