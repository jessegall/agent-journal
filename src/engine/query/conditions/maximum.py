from dataclasses import dataclass

from engine.database.statement import Statement


@dataclass(frozen=True)
class Maximum:
    """Matches rows whose column is at most a value."""

    column: str
    value: object

    def statement(self) -> Statement:
        return Statement(f"{self.column} <= ?", [self.value])
