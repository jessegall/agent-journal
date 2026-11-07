from dataclasses import dataclass

from core.base.database.statement import Statement


@dataclass(frozen=True)
class IsNull:
    """Matches rows whose column has no value."""

    column: str

    def statement(self) -> Statement:
        return Statement(f"{self.column} IS NULL")
