from dataclasses import dataclass

from engine.query.expressions.expression import Expression
from engine.query.order import Order


@dataclass(frozen=True)
class Lag(Expression):
    """The value of the row before, in the given order."""

    expression: Expression
    order: Order

    def sql(self) -> str:
        return f"lag({self.expression.sql()}) OVER (ORDER BY {self.order.sql})"
