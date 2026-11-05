from core.base.actor import Actor
from core.base.refusal import Refusal
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.memories.models.memory import Memory


class MemoryScope:
    """An agent writes a memory only in its own environment."""

    def __init__(self, agents: AgentRows) -> None:
        self.agents = agents

    def check(self, memory: Memory, agent: Actor, is_new: bool) -> None:
        writer = self.agents.find(agent.id)
        if memory.environment_id != writer.environment_id:
            raise Refusal(f"an agent writes memories only in its own environment, and memory {memory.id} is another's", "ask the user")
