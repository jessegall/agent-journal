from dataclasses import dataclass

from engine.query.expressions.expression import Expression


@dataclass(frozen=True)
class Literal(Expression):
    """A constant value, written into the text: NULL, a number, or any other value as a quoted text with its
    quotes doubled."""

    value: object

    def sql(self) -> str:
        if self.value is None:
            return "NULL"
        if isinstance(self.value, bool):
            return str(int(self.value))
        if isinstance(self.value, (int, float)):
            return repr(self.value)
        return "'" + str(self.value).replace("'", "''") + "'"
