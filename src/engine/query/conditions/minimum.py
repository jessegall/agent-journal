from dataclasses import dataclass

from engine.database.statement import Statement


@dataclass(frozen=True)
class Minimum:
    """Matches rows whose column is at least a value."""

    column: str
    value: object

    def statement(self) -> Statement:
        return Statement(f"{self.column} >= ?", [self.value])
