from core.base.actor import Actor
from core.base.agent_role import AgentRole
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.memories.models.memory import Memory


class MemoryScope:
    """Where an agent may write a memory: in its own environment, for the environment or for itself; never
    another helper's own. A helper writes only for itself, so nothing it keeps reaches the main agent."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, memory: Memory, agent: Actor, is_new: bool) -> None:
        writer = self.queries.query(Agent).find(agent.id)
        if memory.environment_id != writer.environment_id:
            raise Refusal(f"an agent writes memories only in its own environment, and memory {memory.id} is another's", "ask the user")
        if memory.agent_id is not None and memory.agent_id != agent.id:
            raise Refusal(f"memory {memory.id} is another helper's own memory", "make your own with journal memory make '<text>' --own")
        if memory.agent_id is None and writer.role != AgentRole.MAIN:
            raise Refusal(f"memory {memory.id} is the main agent's", "make your own with journal memory make '<text>' --own")
