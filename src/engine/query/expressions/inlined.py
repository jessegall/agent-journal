from dataclasses import dataclass

from engine.query.condition import Condition
from engine.query.expressions.expression import Expression
from engine.query.expressions.literal import Literal

PLACEHOLDER = "?"


@dataclass(frozen=True)
class Inlined(Expression):
    """A condition written with its values in place of its placeholders, as a view needs it."""

    condition: Condition

    def sql(self) -> str:
        return f"({self.text()})"

    def text(self) -> str:
        statement = self.condition.statement()
        pieces = statement.sql.split(PLACEHOLDER)
        values = [Literal(value).sql() for value in statement.parameters]
        if len(values) != len(pieces) - 1:
            raise ValueError(f"{len(values)} values for {len(pieces) - 1} placeholders in {statement.sql}")
        return "".join(piece + value for piece, value in zip(pieces, [*values, ""]))
