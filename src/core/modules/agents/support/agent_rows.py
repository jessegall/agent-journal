from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.database.kept_rows import KeptRows
from core.base.listener.event_rows import EventRows
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.agent_role import AgentRole
from core.base.scope.environment_scope import EnvironmentScope
from core.base.scope.scopes import Scopes
from core.modules.agents.models.agent import Agent
from core.modules.agents.queries.agent_query import AgentQuery
from core.modules.agents.support.main_agent_finder import MainAgentFinder


class AgentRows:
    """Shares agent lookups until the matching agent changes: running agents are one row set for every environment,
    so all readers in a tick share it."""

    def __init__(self, queries: Queries, agents: AgentQuery, kept: KeptRows, rows: EventRows, scopes: Scopes) -> None:
        self.queries, self.agents, self.kept, self.rows, self.scopes = queries, agents, kept, rows, scopes

    def session(self, session: str) -> Agent | None:
        with self.scopes.opened(None, disabled=[EnvironmentScope]):
            return self.kept.read("agents", lambda: self.queries.query(Agent).filter(session=session).first(),
                                  "session = ?", [session], name="agents.session")

    def launch_row(self, launch_name: str) -> Agent | None:
        with self.scopes.opened(None, disabled=[EnvironmentScope]):
            bound = self.kept.read("agents", lambda: self.queries.query(Agent).filter(launch_name=launch_name).first(),
                                   "launch_name = ?", [launch_name], name="agents.launch_row")
        return bound if bound is not None else self.session(launch_name)

    def find(self, agent_id: int) -> Agent:
        return self.rows.required(Agent, agent_id)

    def find_unscoped(self, agent_id: int) -> Agent:
        with self.scopes.opened(None, disabled=[EnvironmentScope]):
            return self.rows.required(Agent, agent_id)

    def find_many(self, agent_ids: list[int]) -> list[Agent]:
        return self.queries.query(Agent).find_many(agent_ids)

    def is_main(self, agent_id: int) -> bool:
        return self.find(agent_id).role == AgentRole.MAIN

    def require_main(self, actor: Actor, action: str) -> None:
        if actor.type is not ActorType.AGENT:
            return
        caller = self.find(actor.id)
        if caller.role != AgentRole.MAIN:
            raise Refusal(f"a {caller.role} cannot {action}", "ask the main agent or a person")

    def is_visible(self, agent_id: int) -> bool:
        return self.rows.find(Agent, agent_id) is not None

    def running(self, role: str | None = None, parent_id: int | None = None) -> tuple[Agent, ...]:
        environment_id = self.scopes.environment_id
        with self.scopes.opened(None, disabled=[EnvironmentScope]):
            agents = self.kept.read("agents", lambda: tuple(self.agents.running().oldest().all_rows()), "ended_at IS NULL", name="agents.running")
        agents = tuple(agent for agent in agents if environment_id is None or agent.environment_id == environment_id)
        agents = tuple(agent for agent in agents if role is None or agent.role == role)
        return tuple(agent for agent in agents if parent_id is None or agent.parent_id == parent_id)

    def running_main_agents(self) -> tuple[Agent, ...]:
        return self.kept.scoped_read("agents", lambda: MainAgentFinder.all_running(self.queries),
                                       "role = ? AND ended_at IS NULL", [AgentRole.MAIN], name="agents.running_main_agents")

    def main_agent(self) -> Agent | None:
        return max(self.running_main_agents(), key=lambda agent: agent.id, default=None)

    def main_agents(self) -> tuple[Agent, ...]:
        main = self.main_agent()
        return tuple([main]) if main is not None else ()
