from dataclasses import dataclass

from engine.query.enums.comparison_operator import ComparisonOperator
from engine.query.expressions.expression import Expression


@dataclass(frozen=True)
class Comparison(Expression):
    """Two expressions compared; as a value it is 1 when the comparison holds and 0 when it does not."""

    first_operand: Expression
    operator: ComparisonOperator
    second_operand: Expression

    def sql(self) -> str:
        return f"({self.first_operand.sql()} {self.operator} {self.second_operand.sql()})"
