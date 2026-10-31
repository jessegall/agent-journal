from dataclasses import dataclass

from core.base.database.statement import Statement
from core.base.query.condition import Condition


@dataclass(frozen=True)
class SubqueryMatch:
    """Matches rows whose column is among the results of another query, or, with negated, rows whose column is not."""

    column: str
    select: Condition
    negated: bool = False

    def statement(self) -> Statement:
        inner = self.select.statement()
        return Statement(f"{self.column} {'NOT IN' if self.negated else 'IN'} ({inner.sql})", inner.parameters)
