from core.base.actor import Actor
from core.base.command.command import Command
from engine.errors.user_approval_refusal import UserApprovalRefusal
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.memories.models.memory import Memory


class MemoryScope:
    """An agent writes a memory only in its own environment."""

    def __init__(self, agents: AgentRows) -> None:
        self.agents = agents

    def check(self, memory: Memory, agent: Actor, is_new: bool, command: Command[object]) -> None:
        writer = self.agents.find(agent.id)
        if memory.environment_id != writer.environment_id:
            raise UserApprovalRefusal(f"Change memory {memory.id} in another environment?", command=command)
