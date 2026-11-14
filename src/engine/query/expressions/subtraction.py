from dataclasses import dataclass

from engine.query.expressions.expression import Expression


@dataclass(frozen=True)
class Subtraction(Expression):
    """One value less another."""

    first_operand: Expression
    second_operand: Expression

    def sql(self) -> str:
        return f"({self.first_operand.sql()} - {self.second_operand.sql()})"
