from core.base.database.kept_rows import KeptRows
from core.base.listener.event_rows import EventRows
from core.base.query.queries import Queries
from core.base.agent_role import AgentRole
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.main_agent_finder import MainAgentFinder


class AgentRows:
    """Shares agent lookups until the matching agent changes."""

    def __init__(self, queries: Queries, kept: KeptRows, rows: EventRows) -> None:
        self.queries, self.kept, self.rows = queries, kept, rows

    def session(self, session: str) -> Agent | None:
        return self.kept.read("agents", lambda: self.queries.query(Agent).filter(session=session).first(),
                              "session = ?", [session], name="agents.session")

    def find(self, agent_id: int) -> Agent:
        return self.rows.required(Agent, agent_id)

    def running_mains(self) -> tuple[Agent, ...]:
        return self.kept.read("agents", lambda: MainAgentFinder.all_running(self.queries),
                              "role = ? AND ended_at IS NULL", [AgentRole.MAIN], name="agents.running_mains")

    def main_agent(self, environment_id: int) -> Agent | None:
        return max((agent for agent in self.running_mains() if agent.environment_id == environment_id), key=lambda agent: agent.id, default=None)

    def main_agents(self, environment_id: int) -> tuple[Agent, ...]:
        main = self.main_agent(environment_id)
        return tuple([main]) if main is not None else ()
