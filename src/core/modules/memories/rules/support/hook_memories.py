from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.memories.queries.active_memory_query import ActiveMemoryQuery


class HookMemories:
    """The active memories an agent is given: a main agent its environment's and its own, and any other agent
    only what it made itself; what a helper needs from the main agent is in its brief."""

    def __init__(self, active: ActiveMemoryQuery, queries: Queries) -> None:
        self.active, self.queries = active, queries

    def query(self, hook: AgentHook) -> ActiveMemoryQuery:
        return self.role_query(hook.role, hook.agent_id, hook.environment_id)

    def agent_query(self, agent_id: int, environment_id: int) -> ActiveMemoryQuery:
        return self.role_query(self.queries.query(Agent).find(agent_id).role, agent_id, environment_id)

    def role_query(self, role: str, agent_id: int, environment_id: int) -> ActiveMemoryQuery:
        return self.active.scope(agent_id, environment_id) if role == AgentRole.MAIN else self.active.agent_memories(agent_id)
