from core.base.actor import Actor
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.memories.models.memory import Memory


class MemoryScope:
    """An agent writes a memory only in its own environment."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, memory: Memory, agent: Actor, is_new: bool) -> None:
        writer = self.queries.query(Agent).find(agent.id)
        if memory.environment_id != writer.environment_id:
            raise Refusal(f"an agent writes memories only in its own environment, and memory {memory.id} is another's", "ask the user")
