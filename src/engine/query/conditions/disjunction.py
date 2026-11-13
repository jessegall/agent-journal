from collections.abc import Sequence
from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.condition import Condition
from engine.query.conditions.joined_conditions import joined_conditions


@dataclass(frozen=True)
class Disjunction:
    """Matches rows any of the conditions matches; with none it matches nothing."""

    conditions: Sequence[Condition]

    def statement(self) -> Statement:
        return joined_conditions(self.conditions, "OR", "0")
