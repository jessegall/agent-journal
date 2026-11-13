from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.errors.unknown_operator_error import UnknownOperatorError

COLUMN_OPERATORS = ("=", "!=", "<", "<=", ">", ">=")


@dataclass(frozen=True)
class ColumnCompare:
    """Matches rows whose column compares so with another column, which may name an outer table as table.column."""

    column: str
    operator: str
    compared_column: str

    def statement(self) -> Statement:
        if self.operator not in COLUMN_OPERATORS:
            raise UnknownOperatorError(f"unknown operator {self.operator}; use one of {' '.join(COLUMN_OPERATORS)}")
        return Statement(f"{self.column} {self.operator} {self.compared_column}")
