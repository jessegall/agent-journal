from core.base.actor import CORE_ACTOR_ID
from core.base.database.actor_table import ActorTable
from core.base.database.database import Database
from core.base.upgrade.move_map import MoveMap

USER = "user"
AGENT = "agent"


class CreatorResolver:
    """The version 5 actor of a version 4 creator, written type:id: a user by its moved row, an agent by the actor
    its session made, and the system, a plugin, a phone or anyone not moved as the core."""

    def __init__(self, target: Database, map: MoveMap) -> None:
        self.actors, self.map = ActorTable(target), map

    def actor_id(self, creator: str | None) -> int:
        actor_type, _, identity = (creator or "").partition(":")
        if actor_type == USER and identity.isdigit():
            return self.map.new_id("users", int(identity)) or CORE_ACTOR_ID
        if actor_type == AGENT:
            return self.actors.agent_actor_id(identity) or CORE_ACTOR_ID
        return CORE_ACTOR_ID
