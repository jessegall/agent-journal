import re
from dataclasses import dataclass

from engine.query.errors.unnamed_expression_error import UnnamedExpressionError

NAME = re.compile(r"[A-Za-z_][A-Za-z0-9_]*")


@dataclass(frozen=True)
class SqlName:
    """A table, column or alias name, refused unless it is a plain SQL name, so no SQL text passes as one."""

    text: str

    def __post_init__(self) -> None:
        parts = self.text.split(".")
        if len(parts) > 2 or not all(NAME.fullmatch(part) or (part == "*" and index == len(parts) - 1) for index, part in enumerate(parts)):
            raise UnnamedExpressionError(f"{self.text!r} is not a plain SQL name")
