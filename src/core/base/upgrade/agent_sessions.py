from core.base.upgrade.move_map import MoveMap
from core.base.upgrade.version_four_source import VersionFourSource

AGENTS = "agents"


class AgentSessions:
    """The version 5 agent row behind a version 4 session, found through the agents move's map."""

    def __init__(self, source: VersionFourSource, map: MoveMap) -> None:
        self.map = map
        self.old_ids = {row["session"]: row["id"] for row in source.rows(AGENTS) if row["session"]}

    def agent_id(self, session: str) -> int | None:
        old_id = self.old_ids.get(session)
        return self.map.new_id(AGENTS, old_id) if old_id is not None else None
