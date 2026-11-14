from dataclasses import dataclass

from engine.query.expressions.expression import Expression
from engine.query.expressions.literal import Literal


@dataclass(frozen=True)
class JsonPath(Expression):
    """The part of a JSON value at a path, kept as JSON text (the -> operator)."""

    expression: Expression
    path: str

    def sql(self) -> str:
        return f"{self.expression.sql()} -> {Literal(self.path).sql()}"
