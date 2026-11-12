from dataclasses import dataclass

from engine.query.expressions.expression import Expression


@dataclass(frozen=True)
class CountAll(Expression):
    """How many rows a SELECT or a group of it holds."""

    def sql(self) -> str:
        return "count(*)"
