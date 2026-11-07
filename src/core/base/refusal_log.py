from core.base.query.conditions.greater import Greater
from core.base.query.conditions.equal import Equal
from core.base.actor import Actor
from core.base.clock import Clock
from core.base.database.bookkeeping_table import BookkeepingTable
from core.base.database.database import Database
from core.base.guard.guard_refusal import GuardRefusal
from core.base.page import Page
from core.base.refusal import Refusal
from core.base.recorded_refusal import RecordedRefusal
from core.base.query.conditions.prefix import Prefix
from core.base.query.select import Select


class RefusalLog:
    """Records each refused command after its own transaction has rolled back, so a refusal leaves a trace."""

    def __init__(self, database: Database, clock: Clock) -> None:
        self.database, self.clock = database, clock
        self.table = BookkeepingTable(database, "refusals", "refusal")

    def refusal(self, refusal_id: int) -> RecordedRefusal:
        return RecordedRefusal.parsed(self.table.row(refusal_id))

    def page(self, number: int, size: int) -> Page[RecordedRefusal]:
        return self.table.newest_page(number, size, RecordedRefusal.parsed)

    def count_with_reason(self, prefix: str) -> int:
        selection = Select("refusals").matching(Prefix("reason", prefix))
        return self.database.rows(selection.count_statement())[0][0]

    def guard_refused_past(self, actor_id: int, guard: str, created_after: str) -> bool:
        selection = Select("refusals").matching(Equal("actor_id", actor_id)).matching(Equal("guard", guard)).matching(Greater("created_at", created_after))
        return self.database.rows(selection.count_statement())[0][0] > 0

    def guards_refused_past(self, actor_id: int, created_after: str) -> set[str]:
        selection = Select("refusals").column("DISTINCT guard").matching(Equal("actor_id", actor_id)).matching(Greater("created_at", created_after))
        return {row[0] for row in self.database.rows(selection.statement())}

    def record(self, actor: Actor, command: str, refusal: Refusal) -> None:
        guard = refusal.guard if isinstance(refusal, GuardRefusal) else ""
        with self.database.transaction():
            self.table.insert({"actor_id": actor.id, "command": command, "guard": guard, "reason": refusal.text, "created_at": self.clock.timestamp().text})
