from core.base.actor import Actor
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.agents.agent import Agent
from core.modules.memories.memory import Memory


class MemoryScope:
    """Where an agent may write a memory: in its own environment, for the environment or for itself; never for the
    whole project and never another helper's own."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, memory: Memory, agent: Actor) -> None:
        if memory.environment_id is None:
            raise Refusal("a project memory is the user's", "make it for your environment, or ask the user")
        if memory.environment_id != self.queries.query(Agent).find(agent.id).environment_id:
            raise Refusal(f"an agent writes memories only in its own environment, and memory {memory.id} is another's", "ask the user")
        if memory.agent_id is not None and memory.agent_id != agent.id:
            raise Refusal(f"memory {memory.id} is another helper's own memory", "make your own with journal memory make '<text>' --type fact --own")
