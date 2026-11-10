from dataclasses import dataclass

from core.base.database.statement import Statement


@dataclass(frozen=True)
class Equal:
    """Matches rows whose column equals a value, or, with negated, rows whose column does not."""

    column: str
    value: object
    negated: bool = False

    def statement(self) -> Statement:
        null_test, operator = ("IS NOT NULL", "IS NOT") if self.negated else ("IS NULL", "=")
        if self.value is None:
            return Statement(f"{self.column} {null_test}")
        return Statement(f"{self.column} {operator} ?", [self.value])
