from collections.abc import Sequence
from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.condition import Condition
from engine.query.conditions.joined_conditions import joined_conditions


@dataclass(frozen=True)
class AllOf:
    """Matches rows every condition matches; with none it matches every row."""

    conditions: Sequence[Condition]

    def statement(self) -> Statement:
        return joined_conditions(self.conditions, "AND", "1")
