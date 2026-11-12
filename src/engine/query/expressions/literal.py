from dataclasses import dataclass

from engine.query.expressions.expression import Expression


@dataclass(frozen=True)
class Literal(Expression):
    """A constant value, written into the text: NULL, a number, or a quoted text with its quotes doubled."""

    value: str | int | float | bool | None

    def sql(self) -> str:
        if self.value is None:
            return "NULL"
        if isinstance(self.value, bool):
            return str(int(self.value))
        if isinstance(self.value, (int, float)):
            return repr(self.value)
        return "'" + self.value.replace("'", "''") + "'"
