from dataclasses import dataclass

from core.base.database.statement import Statement
from core.base.query.condition import Condition


@dataclass(frozen=True)
class SubqueryMatch:
    """Matches rows whose column is among the results of another query."""

    column: str
    select: Condition

    def statement(self) -> Statement:
        inner = self.select.statement()
        return Statement(f"{self.column} IN ({inner.sql})", inner.parameters)
