from dataclasses import dataclass

from engine.query.expressions.expression import Expression
from engine.query.expressions.sql_name import SqlName


@dataclass(frozen=True)
class Aliased(Expression):
    """An expression a SELECT names as a column of its own."""

    expression: Expression
    name: str

    def __post_init__(self) -> None:
        SqlName(self.name)

    def sql(self) -> str:
        return f"{self.expression.sql()} AS {self.name}"
