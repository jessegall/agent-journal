import sqlite3
from dataclasses import dataclass

from core.base.actor import Actor
from core.base.clock import Clock
from core.base.database.bookkeeping_table import BookkeepingTable
from core.base.database.database import Database
from core.base.guard_refusal import GuardRefusal
from core.base.timestamp import Timestamp
from core.base.page import Page
from core.base.refusal import Refusal



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


class RefusalLog:
    """Records each refused command after its own transaction has rolled back, so a refusal leaves a trace."""

    def __init__(self, database: Database, clock: Clock) -> None:
        self.database, self.clock = database, clock
        self.table = BookkeepingTable(database, "refusals", "refusal")

    def refusal(self, refusal_id: int) -> RecordedRefusal:
        return RecordedRefusal.parsed(self.table.row(refusal_id))

    def page(self, number: int, size: int) -> Page[RecordedRefusal]:
        return self.table.newest_page(number, size, RecordedRefusal.parsed)

    def record(self, actor: Actor, command: str, refusal: Refusal) -> None:
        guard = refusal.guard if isinstance(refusal, GuardRefusal) else ""
        with self.database.transaction():
            self.table.insert({"actor_id": actor.id, "command": command, "guard": guard, "reason": refusal.text, "created_at": self.clock.timestamp().text})
