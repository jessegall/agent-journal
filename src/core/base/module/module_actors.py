from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.database.database import Database
from core.base.database.statement import Statement

MODULE_ACTOR_ID = Statement("SELECT id FROM actors WHERE type = ? AND name = ?")


class ModuleActors:
    """The actor a module writes as, which sync makes for each installed module."""

    def __init__(self, database: Database) -> None:
        self.database = database

    def actor(self, module_name: str) -> Actor:
        row = self.database.rows(Statement(MODULE_ACTOR_ID.sql, (ActorType.MODULE.value, module_name)))[0]
        return Actor(row["id"], ActorType.MODULE)
