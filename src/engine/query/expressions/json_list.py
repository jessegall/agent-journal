from dataclasses import dataclass

from engine.query.expressions.expression import Expression


@dataclass(frozen=True)
class JsonList(Expression):
    """The values of a group as a JSON list of texts, '[]' for a group of none."""

    expression: Expression

    def sql(self) -> str:
        return f"coalesce('[' || group_concat(json_quote({self.expression.sql()})) || ']', '[]')"
