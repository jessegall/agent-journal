from dataclasses import dataclass

from engine.query.expressions.expression import Expression


@dataclass(frozen=True)
class Subtraction(Expression):
    """One value less another."""

    left: Expression
    right: Expression

    def sql(self) -> str:
        return f"({self.left.sql()} - {self.right.sql()})"
