from engine.actor.actor import Actor
from engine.database.kept_rows import KeptRows
from engine.listener.rows.event_rows import EventRows
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.scope.environment_scope import EnvironmentScope
from engine.scope.scopes import Scopes
from core.modules.agents.models.agent import Agent
from core.modules.agents.queries.agent_query import AgentQuery
from core.modules.agents.support.main_agent_finder import MainAgentFinder

SESSION_ROWS = 5
RUNNING_AGENTS_REASON = "The agents that have not ended, which the running programs bound; every reader of a request shares this one kept load."


class AgentRows:
    """Shares agent lookups until the matching agent changes: running agents are one row set for every environment,
    so all readers in a tick share it."""

    def __init__(self, queries: Queries, agents: AgentQuery, kept: KeptRows, rows: EventRows, scopes: Scopes) -> None:
        self.queries, self.agents, self.kept, self.rows, self.scopes = queries, agents, kept, rows, scopes

    def session(self, session: str) -> Agent | None:
        with self.scopes.opened(None, disabled=[EnvironmentScope]):
            agents = self.queries.query(Agent).filter(session=session)
            return self.kept.read(agents, lambda: AgentRows.session_holder(agents.newest().take(SESSION_ROWS)), name="agents.session")

    @staticmethod
    def session_holder(rows: list[Agent]) -> Agent | None:
        return next((row for row in rows if row.ended_at is None), rows[0] if rows else None)

    def launch_row(self, launch_name: str) -> Agent | None:
        with self.scopes.opened(None, disabled=[EnvironmentScope]):
            agents = self.queries.query(Agent).filter(launch_name=launch_name)
            bound = self.kept.read(agents, agents.first, name="agents.launch_row")
        return bound if bound is not None else self.session(launch_name)

    def find(self, agent_id: int) -> Agent:
        return self.rows.required(Agent, agent_id)

    def find_unscoped(self, agent_id: int) -> Agent:
        with self.scopes.opened(None, disabled=[EnvironmentScope]):
            return self.rows.required(Agent, agent_id)

    def find_many(self, agent_ids: list[int]) -> list[Agent]:
        return self.queries.query(Agent).find_many(agent_ids)

    def is_main(self, agent_id: int) -> bool:
        return self.find(agent_id).is_main

    def has_profile(self, agent_id: int, profile: str) -> bool:
        return self.find(agent_id).profile == profile

    def require_main(self, actor: Actor, action: str) -> None:
        if not actor.is_agent():
            return
        caller = self.find(actor.id)
        if not caller.is_main:
            raise Refusal(f"a {caller.role} cannot {action}", "ask the main agent or a user")

    def is_visible(self, agent_id: int) -> bool:
        return self.rows.find(Agent, agent_id) is not None

    def running(self, role: str | None = None, parent_id: int | None = None) -> tuple[Agent, ...]:
        environment_id = self.scopes.environment_id
        with self.scopes.opened(None, disabled=[EnvironmentScope]):
            running = self.agents.running().oldest()
            agents = self.kept.read(running, lambda: tuple(running.every_row(RUNNING_AGENTS_REASON)), name="agents.running")
        agents = tuple(agent for agent in agents if environment_id is None or agent.environment_id == environment_id)
        agents = tuple(agent for agent in agents if role is None or agent.role == role)
        return tuple(agent for agent in agents if parent_id is None or agent.parent_id == parent_id)

    def running_main_agents(self) -> tuple[Agent, ...]:
        mains = MainAgentFinder.running(self.queries)
        return self.kept.read(mains, lambda: tuple(mains.get()), name="agents.running_main_agents")

    def numbered_main(self, environment_id: int) -> Agent | None:
        with self.scopes.opened(None, environment_id):
            return MainAgentFinder.numbered_one(self.queries)

    def main_agent(self) -> Agent | None:
        return max(self.running_main_agents(), key=lambda agent: agent.id, default=None)

    def environment_main_agent(self, environment_id: int) -> Agent | None:
        running = [agent for agent in self.running_main_agents() if agent.environment_id == environment_id]
        return max(running, key=lambda agent: agent.id, default=None)

    def main_agents(self) -> tuple[Agent, ...]:
        main = self.main_agent()
        return tuple([main]) if main is not None else ()
