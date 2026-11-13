from dataclasses import dataclass

from engine.database.statement import Statement


@dataclass(frozen=True)
class MinimumDuration:
    """Matches rows that have both times and whose end came at least the given seconds after their start."""

    start_column: str
    end_column: str
    seconds: float

    def statement(self) -> Statement:
        return Statement(f"{self.start_column} > '' AND {self.end_column} > '' AND (julianday({self.end_column}) - julianday({self.start_column})) * 86400 >= ?", [self.seconds])
