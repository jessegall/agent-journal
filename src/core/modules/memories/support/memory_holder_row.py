from dataclasses import dataclass

from core.base.agent_type_book import AgentTypeBook
from core.base.timestamp import Timestamp
from core.modules.memories.models.memory_holder import MemoryHolder


@dataclass(frozen=True)
class MemoryHolderRow:
    """The details and memory counts shown for an agent."""

    agent_id: int
    environment_id: int
    role: str
    name: str
    started_at: Timestamp
    ended_at: Timestamp | None
    active_memories: int
    removed_memories: int

    @classmethod
    def built(cls, holder: MemoryHolder, types: AgentTypeBook) -> "MemoryHolderRow":
        name = holder.given_name or f"{types.label(holder.role)} {holder.agent_id}"
        return cls(holder.agent_id, holder.environment_id, holder.role, name, holder.started_at, holder.ended_at, holder.active_memories, holder.removed_memories)
