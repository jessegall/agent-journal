from core.base.actor import CORE_ACTOR_ID, ActorType
from core.base.database.database import Database
from core.base.database.statement import Statement

CORE_ACTOR = Statement("INSERT OR IGNORE INTO actors (id, type, name, created_at, updated_at) VALUES (?, ?, 'core', ?, ?)")
MODULE_ACTOR = Statement("INSERT OR IGNORE INTO actors (created_by, type, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)")
MODULE_ACTOR_ID = Statement("SELECT id FROM actors WHERE type = ? AND name = ?")


class ActorTable:
    """The actors the core itself makes: its own, on the first sync, and one for each module."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def core_actor(self, moment: str) -> None:
        self.database.update(Statement(CORE_ACTOR.sql, (CORE_ACTOR_ID, ActorType.CORE.value, moment, moment)))

    def module_actor(self, module: str, moment: str) -> int:
        self.database.update(Statement(MODULE_ACTOR.sql, (CORE_ACTOR_ID, ActorType.MODULE.value, module, moment, moment)))
        return self.database.rows(Statement(MODULE_ACTOR_ID.sql, (ActorType.MODULE.value, module)))[0]["id"]
