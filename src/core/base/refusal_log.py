from core.base.actor import Actor
from core.base.clock import Clock
from core.base.database.bookkeeping_table import BookkeepingTable
from core.base.database.database import Database
from core.base.guard.guard_refusal import GuardRefusal
from core.base.page import Page
from core.base.refusal import Refusal
from core.base.recorded_refusal import RecordedRefusal


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
