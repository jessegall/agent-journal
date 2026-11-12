from dataclasses import dataclass

from engine.query.enums.comparison_operator import ComparisonOperator
from engine.query.expressions.expression import Expression


@dataclass(frozen=True)
class Comparison(Expression):
    """Two expressions compared; as a value it is 1 when the comparison holds and 0 when it does not."""

    left: Expression
    operator: ComparisonOperator
    right: Expression

    def sql(self) -> str:
        return f"({self.left.sql()} {self.operator} {self.right.sql()})"
