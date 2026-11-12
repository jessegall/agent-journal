from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.select import Select


@dataclass(frozen=True)
class Exists:
    """Matches rows for which an inner query, scoped already, finds a row, or, with negated, finds none."""

    select: Select
    negated: bool = False

    def statement(self) -> Statement:
        inner = self.select.filtered(Statement(f"SELECT 1 FROM {self.select.table}"))
        return Statement(f"{'NOT ' if self.negated else ''}EXISTS ({inner.sql})", inner.parameters)
