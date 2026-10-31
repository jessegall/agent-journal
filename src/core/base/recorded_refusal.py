import sqlite3
from dataclasses import dataclass
from core.base.timestamp import Timestamp


@dataclass(frozen=True)
class RecordedRefusal:
    """A refusal as the refusals table holds it."""

    id: int
    actor_id: int
    command: str
    guard: str
    reason: str
    timestamp: Timestamp

    @classmethod
    def parsed(cls, row: sqlite3.Row) -> "RecordedRefusal":
        return cls(row["id"], row["actor_id"], row["command"], row["guard"], row["reason"], Timestamp.parsed(row["created_at"]))
