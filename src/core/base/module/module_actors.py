from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.database.actor_table import ActorTable


class ModuleActors:
    """The actor a module writes as, which sync makes for each installed module."""

    def __init__(self, table: ActorTable) -> None:
        self.table = table

    def actor(self, module_name: str) -> Actor:
        return Actor(self.table.module_actor_id(module_name), ActorType.MODULE)
