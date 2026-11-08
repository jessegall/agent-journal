from dataclasses import dataclass

from core.base.database.statement import Statement


@dataclass(frozen=True)
class IsNotNull:
    """Matches rows whose column has a value."""

    column: str

    def statement(self) -> Statement:
        return Statement(f"{self.column} IS NOT NULL")
