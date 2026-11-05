from core.base.database.kept_rows import KeptRows
from core.base.listener.event_rows import EventRows
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent


class AgentRows:
    """Shares agent lookups until the matching agent changes."""

    def __init__(self, queries: Queries, kept: KeptRows, rows: EventRows) -> None:
        self.queries, self.kept, self.rows = queries, kept, rows

    def session(self, session: str) -> Agent | None:
        return self.kept.read("agents", lambda: self.queries.query(Agent).filter(session=session).first(),
                              "session = ?", [session], name="agents.session")

    def find(self, agent_id: int) -> Agent:
        return self.rows.required(Agent, agent_id)
