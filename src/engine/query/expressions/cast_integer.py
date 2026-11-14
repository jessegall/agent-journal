from dataclasses import dataclass

from engine.query.expressions.expression import Expression


@dataclass(frozen=True)
class CastInteger(Expression):
    """A value read as a whole number."""

    expression: Expression

    def sql(self) -> str:
        return f"CAST({self.expression.sql()} AS INTEGER)"
