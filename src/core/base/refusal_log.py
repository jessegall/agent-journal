from core.base.actor import Actor
from core.base.clock import Clock
from core.base.database.database import Database
from core.base.database.statement import Statement
from core.base.guard_refusal import GuardRefusal
from core.base.refusal import Refusal

INSERT = Statement("INSERT INTO refusals (actor_id, command, guard, reason, created_at) VALUES (?, ?, ?, ?, ?)")


class RefusalLog:
    """Records each refused command after its own transaction has rolled back, so a refusal leaves a trace."""

    def __init__(self, database: Database, clock: Clock) -> None:
        self.database, self.clock = database, clock

    def record(self, actor: Actor, command: str, refusal: Refusal) -> None:
        guard = refusal.guard if isinstance(refusal, GuardRefusal) else ""
        with self.database.transaction():
            self.database.insert(Statement(INSERT.sql, (actor.id, command, guard, refusal.text, self.clock.moment().text)))
