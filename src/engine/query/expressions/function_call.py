from collections.abc import Sequence
from dataclasses import dataclass

from engine.query.enums.sql_function import SqlFunction
from engine.query.expressions.expression import Expression


@dataclass(frozen=True)
class FunctionCall(Expression):
    """A call of one of the SQL functions the builder knows, with its arguments; distinct counts each value once."""

    function: SqlFunction
    arguments: Sequence[Expression]
    distinct: bool = False

    def sql(self) -> str:
        return f"{self.function}({'DISTINCT ' if self.distinct else ''}{', '.join(argument.sql() for argument in self.arguments)})"
