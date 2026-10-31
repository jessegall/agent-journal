from collections.abc import Sequence

from core.modules.memories.standing_memory import StandingMemory


class MemoryLines:
    """The one writer of the agent's lines about memories: one line per memory, and the line that asks the agent to
    weigh them at a context mark."""

    @staticmethod
    def listing(memories: Sequence[StandingMemory]) -> tuple[str, ...]:
        return tuple(f"memory {memory.memory_id}, {memory.type}, weight {memory.weight}: {memory.text}" for memory in memories)

    @staticmethod
    def weigh(percent: int, memories: Sequence[StandingMemory]) -> tuple[str, ...]:
        ids = ",".join(str(memory.memory_id) for memory in memories)
        request = (f"Your context window passed {percent}%: weigh these memories, keeping or raising each weight, with journal memory weigh"
                   f" {ids or '<ids>'} <weights>, or say why nothing needs keeping with journal memory skip \"<why>\"")
        return (request, *MemoryLines.listing(memories))
