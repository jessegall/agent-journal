from dataclasses import dataclass

from core.base.database.statement import Statement
from core.base.timestamp import Timestamp


@dataclass(frozen=True)
class DueMemory:
    """Matches the memories whose due time has come by the timestamp."""

    timestamp: Timestamp

    def statement(self) -> Statement:
        return Statement("due_at IS NOT NULL AND due_at <= ?", [self.timestamp.text])
