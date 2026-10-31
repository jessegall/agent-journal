from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.memories.memory import Memory


@dataclass(frozen=True)
class MemoryRead(Command[Memory]):
    """Reads one memory whole, kept as a delivery to the agent that reads it."""

    memory_id: int
