from core.base.actor import CORE_ACTOR_ID
from core.base.actor_type import ActorType
from core.base.database.database import Database
from core.base.database.statement import Statement

CORE_ACTOR = Statement("INSERT OR IGNORE INTO actors (id, type, name, created_at, updated_at) VALUES (?, ?, 'core', ?, ?)")
MODULE_ACTOR = Statement("INSERT OR IGNORE INTO actors (creator_id, type, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)")
MODULE_ACTOR_ID = Statement("SELECT id FROM actors WHERE type = ? AND name = ?")


class ActorTable:
    """The actors the core itself makes: its own, on the first sync, and one for each module."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def core_actor(self, timestamp: str) -> None:
        self.database.update(Statement(CORE_ACTOR.sql, (CORE_ACTOR_ID, ActorType.CORE.value, timestamp, timestamp)))

    def module_actor(self, module: str, timestamp: str) -> int:
        self.database.update(Statement(MODULE_ACTOR.sql, (CORE_ACTOR_ID, ActorType.MODULE.value, module, timestamp, timestamp)))
        return self.database.rows(Statement(MODULE_ACTOR_ID.sql, (ActorType.MODULE.value, module)))[0]["id"]

    def module_actor_id(self, module: str) -> int:
        return self.database.rows(Statement(MODULE_ACTOR_ID.sql, (ActorType.MODULE.value, module)))[0]["id"]
