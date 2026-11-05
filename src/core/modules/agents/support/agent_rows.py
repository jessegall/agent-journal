from core.base.database.kept_rows import KeptRows
from core.base.listener.event_rows import EventRows
from core.base.query.queries import Queries
from core.base.agent_role import AgentRole
from core.base.scope.environment_scope import EnvironmentScope
from core.base.scope.scopes import Scopes
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.main_agent_finder import MainAgentFinder


class AgentRows:
    """Shares agent lookups until the matching agent changes."""

    def __init__(self, queries: Queries, kept: KeptRows, rows: EventRows, scopes: Scopes) -> None:
        self.queries, self.kept, self.rows, self.scopes = queries, kept, rows, scopes

    def session(self, session: str) -> Agent | None:
        with self.scopes.opened(None, disabled=[EnvironmentScope]):
            return self.kept.read("agents", lambda: self.queries.query(Agent).filter(session=session).first(),
                                  "session = ?", [session], name="agents.session")

    def find(self, agent_id: int) -> Agent:
        return self.rows.required(Agent, agent_id)

    def is_visible(self, agent_id: int) -> bool:
        return self.rows.find(Agent, agent_id) is not None

    def running_mains(self) -> tuple[Agent, ...]:
        return self.kept.scoped_read("agents", lambda: MainAgentFinder.all_running(self.queries),
                                       "role = ? AND ended_at IS NULL", [AgentRole.MAIN], name="agents.running_mains")

    def main_agent(self) -> Agent | None:
        return max(self.running_mains(), key=lambda agent: agent.id, default=None)

    def main_agents(self) -> tuple[Agent, ...]:
        main = self.main_agent()
        return tuple([main]) if main is not None else ()
