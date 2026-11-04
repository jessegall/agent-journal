from core.base.actor import Actor
from core.base.agent_role import AgentRole
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.memories.models.memory import Memory


class MemoryScope:
    """Where an agent may write a memory: in its own environment, for the environment or for itself; never
    for the whole project and never another helper's own. A helper writes only for itself, so nothing it
    keeps reaches the main agent. A main agent may change a project memory that an agent wrote, never one the
    user wrote."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def check(self, memory: Memory, agent: Actor, is_new: bool) -> None:
        writer = self.queries.query(Agent).find(agent.id)
        if memory.environment_id is None:
            self.check_project_memory(memory, writer, is_new)
            return
        if memory.environment_id != writer.environment_id:
            raise Refusal(f"an agent writes memories only in its own environment, and memory {memory.id} is another's", "ask the user")
        if memory.agent_id is not None and memory.agent_id != agent.id:
            raise Refusal(f"memory {memory.id} is another helper's own memory", "make your own with journal memory make '<text>' --type fact --own")
        if memory.agent_id is None and writer.role != AgentRole.MAIN:
            raise Refusal(f"memory {memory.id} is the main agent's", "make your own with journal memory make '<text>' --type fact --own")

    def check_project_memory(self, memory: Memory, writer: Agent, is_new: bool) -> None:
        is_agent_memory = self.queries.query(Agent).filter(id=memory.creator_id).exists()
        if is_new or writer.role != AgentRole.MAIN or not is_agent_memory:
            raise Refusal("a project memory is the user's", "make it for your environment, or ask the user")
