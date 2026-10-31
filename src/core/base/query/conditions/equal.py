from dataclasses import dataclass

from core.base.database.statement import Statement


@dataclass(frozen=True)
class Equal:
    """Matches rows whose column equals a value."""

    column: str
    value: object

    def statement(self) -> Statement:
        if self.value is None:
            return Statement(f"{self.column} IS NULL")
        return Statement(f"{self.column} = ?", (self.value,))
