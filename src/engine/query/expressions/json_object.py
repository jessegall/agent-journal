from collections.abc import Mapping
from dataclasses import dataclass

from engine.query.expressions.expression import Expression
from engine.query.expressions.literal import Literal


@dataclass(frozen=True)
class JsonObject(Expression):
    """A JSON object of the given keys and their values, in the order given."""

    fields: Mapping[str, Expression]

    def sql(self) -> str:
        return "json_object(" + ", ".join(f"{Literal(key).sql()}, {value.sql()}" for key, value in self.fields.items()) + ")"
