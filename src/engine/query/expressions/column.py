from dataclasses import dataclass

from engine.query.expressions.expression import Expression
from engine.query.expressions.sql_name import SqlName


@dataclass(frozen=True)
class Column(Expression):
    """A column, by its name or by table.column."""

    name: str

    def __post_init__(self) -> None:
        SqlName(self.name)

    def sql(self) -> str:
        return self.name
