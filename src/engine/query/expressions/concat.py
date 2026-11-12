from collections.abc import Sequence
from dataclasses import dataclass

from engine.query.expressions.expression import Expression


@dataclass(frozen=True)
class Concat(Expression):
    """Texts joined end to end."""

    parts: Sequence[Expression]

    def sql(self) -> str:
        return "(" + " || ".join(part.sql() for part in self.parts) + ")"
