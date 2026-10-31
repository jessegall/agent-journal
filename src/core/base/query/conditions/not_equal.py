from dataclasses import dataclass

from core.base.database.statement import Statement


@dataclass(frozen=True)
class NotEqual:
    """Matches rows whose column does not equal a value."""

    column: str
    value: object

    def statement(self) -> Statement:
        if self.value is None:
            return Statement(f"{self.column} IS NOT NULL")
        return Statement(f"{self.column} IS NOT ?", (self.value,))
