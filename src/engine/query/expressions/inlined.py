from dataclasses import dataclass

from engine.query.conditions.condition import Condition
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
        parts = statement.sql.split(PLACEHOLDER)
        values = [Literal(value).sql() for value in statement.parameters]
        if len(values) != len(parts) - 1:
            raise ValueError(f"{len(values)} values for {len(parts) - 1} placeholders in {statement.sql}")
        return "".join(part + value for part, value in zip(parts, [*values, ""]))
