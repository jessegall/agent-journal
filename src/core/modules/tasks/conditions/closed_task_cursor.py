from dataclasses import dataclass

from engine.database.statement import Statement


@dataclass(frozen=True)
class ClosedTaskCursor:
    """Matches tasks before a close timestamp and task ID in descending order."""

    closed_at: str
    task_id: int

    def statement(self) -> Statement:
        return Statement("(closed_at, id) < (?, ?)", (self.closed_at, self.task_id))
