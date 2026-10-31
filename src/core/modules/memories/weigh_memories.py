from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.memories.memory import Memory


@dataclass(frozen=True)
class WeighMemories(Command[list[Memory]]):
    """Gives each memory its own weight, or one weight to all of them."""

    memory_ids: tuple[int, ...]
    weights: tuple[int, ...]
