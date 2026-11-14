from dataclasses import dataclass

from engine.query.conditions.condition import Condition
from engine.database.statement import Statement


@dataclass(frozen=True)
class Excluding:
    """Matches the rows the given condition does not match."""

    condition: Condition

    def statement(self) -> Statement:
        inner = self.condition.statement()
        return Statement(f"NOT ({inner.sql})", inner.parameters, inner.scan_reason)
