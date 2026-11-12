from dataclasses import dataclass

from engine.database.statement import Statement
from engine.query.conditions.row_value_before import RowValueBefore


@dataclass(frozen=True)
class ClosedTaskCursor:
    """Matches tasks before a close timestamp and task ID in descending order."""

    closed_at: str
    task_id: int

    def statement(self) -> Statement:
        return RowValueBefore(("closed_at", "id"), (self.closed_at, self.task_id)).statement()
