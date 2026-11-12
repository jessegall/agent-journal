from dataclasses import dataclass

from engine.query.expressions.expression import Expression
from engine.query.expressions.literal import Literal


@dataclass(frozen=True)
class JsonEach(Expression):
    """The items of a JSON list or object as rows of key and value, read as a source; a path picks a part of it."""

    expression: Expression
    path: str = ""

    def sql(self) -> str:
        path = f", {Literal(self.path).sql()}" if self.path else ""
        return f"json_each({self.expression.sql()}{path})"
