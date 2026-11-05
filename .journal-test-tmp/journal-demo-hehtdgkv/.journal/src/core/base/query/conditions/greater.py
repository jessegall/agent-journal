from dataclasses import dataclass

from core.base.database.statement import Statement


@dataclass(frozen=True)
class Greater:
    """Matches rows whose column is greater than a value."""

    column: str
    value: object

    def statement(self) -> Statement:
        return Statement(f"{self.column} > ?", [self.value])
