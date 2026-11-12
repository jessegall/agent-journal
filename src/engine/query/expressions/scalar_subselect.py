from dataclasses import dataclass

from engine.query.expressions.expression import Expression
from engine.query.select import Select


@dataclass(frozen=True)
class ScalarSubselect(Expression):
    """A SELECT inside another: as a column it gives one value, as a source it gives rows to read from."""

    select: Select

    def sql(self) -> str:
        return f"({self.select.view_sql()})"
