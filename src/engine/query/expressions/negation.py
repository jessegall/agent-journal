from dataclasses import dataclass

from engine.query.condition import Condition
from engine.query.expressions.expression import Expression
from engine.query.expressions.inlined import Inlined


@dataclass(frozen=True)
class Negation(Expression):
    """The opposite of a condition."""

    condition: Condition

    def sql(self) -> str:
        return f"NOT {Inlined(self.condition).sql()}"
