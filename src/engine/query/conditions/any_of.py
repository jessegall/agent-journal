from collections.abc import Sequence
from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.condition import Condition


@dataclass(frozen=True)
class AnyOf:
    """Matches rows any of the conditions matches; with none it matches nothing."""

    conditions: Sequence[Condition]

    def statement(self) -> Statement:
        if not self.conditions:
            return Statement("0")
        joined = Statement.all_joined(tuple(condition.statement() for condition in self.conditions), " OR ")
        return Statement(f"({joined.sql})", joined.parameters, joined.scan_reason)
