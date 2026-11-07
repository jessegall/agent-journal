from core.base.actor import Actor
from core.base.user_approval import UserApproval
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.memories.models.memory import Memory


class MemoryScope:
    """An agent writes a memory only in its own environment."""

    def __init__(self, agents: AgentRows) -> None:
        self.agents = agents

    def check(self, memory: Memory, agent: Actor, is_new: bool) -> None:
        writer = self.agents.find(agent.id)
        if memory.environment_id != writer.environment_id:
            raise UserApproval(f"Change memory {memory.id} in another environment?")
