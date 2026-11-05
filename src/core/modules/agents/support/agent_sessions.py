from core.base.database.kept_rows import KeptRows
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent


class AgentSessions:
    """Keeps session lookups until the matching agent changes."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def find(self, session: str) -> Agent | None:
        return self.kept.read("agents", lambda: self.queries.query(Agent).filter(session=session).first(),
                              "session = ?", [session], name="agents.session")
