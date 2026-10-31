from core.base.actor import CORE_ACTOR_ID
from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.version_four_source import VersionFourSource

USER = "user"
AGENT = "agent"


class CreatorResolver:
    """The version 5 actor of a version 4 creator, written type:id: a user by its moved row, an agent by its
    session, and the system, a plugin, a phone or anyone not moved as the core."""

    def __init__(self, source: VersionFourSource, map: MoveMap) -> None:
        self.source, self.map = source, map

    def actor_id(self, creator: str | None) -> int:
        actor_type, _, identity = (creator or "").partition(":")
        if actor_type == USER and identity.isdigit():
            return self.map.new_id("users", int(identity)) or CORE_ACTOR_ID
        if actor_type == AGENT:
            ids = [row["id"] for row in self.source.rows("agents") if row["session"] == identity]
            return (self.map.new_id("agents", ids[0]) if ids else None) or CORE_ACTOR_ID
        return CORE_ACTOR_ID
