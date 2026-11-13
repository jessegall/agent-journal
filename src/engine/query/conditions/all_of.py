from collections.abc import Sequence
from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.condition import Condition


@dataclass(frozen=True)
class AllOf:
    """Matches rows every condition matches; with none it matches every row."""

    conditions: Sequence[Condition]

    def statement(self) -> Statement:
        if not self.conditions:
            return Statement("1")
        joined = Statement.all_joined(tuple(condition.statement() for condition in self.conditions), " AND ")
        return Statement(f"({joined.sql})", joined.parameters, joined.scan_reason)
