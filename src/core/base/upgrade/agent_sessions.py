from core.base.database.actor_table import ActorTable
from core.base.database.database import Database


class AgentSessions:
    """The version 5 agent row behind a version 4 session: the agent whose actor the agents move named for it."""

    def __init__(self, target: Database) -> None:
        self.actors = ActorTable(target)

    def agent_id(self, session: str) -> int | None:
        return self.actors.agent_actor_id(session)
