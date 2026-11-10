from dataclasses import dataclass

from engine.command.command import Command
from core.modules.memories.models.memory import Memory


@dataclass(frozen=True)
class ReadMemory(Command[Memory]):
    """Reads one memory whole, kept as a delivery to the agent that reads it."""

    lock = False

    memory_id: int
