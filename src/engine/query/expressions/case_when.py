from collections.abc import Sequence
from dataclasses import dataclass

from engine.query.conditions.condition import Condition
from engine.query.expressions.expression import Expression
from engine.query.expressions.inlined import Inlined
from engine.query.expressions.literal import Literal


@dataclass(frozen=True)
class CaseWhen(Expression):
    """The value of the first branch whose condition holds, else the value otherwise names, NULL when it names none."""

    branches: Sequence[tuple[Condition, Expression]]
    otherwise: Expression = Literal(None)

    def sql(self) -> str:
        branches = " ".join(f"WHEN {Inlined(condition).sql()} THEN {value.sql()}" for condition, value in self.branches)
        return f"CASE {branches} ELSE {self.otherwise.sql()} END"
