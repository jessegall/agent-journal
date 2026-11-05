from dataclasses import dataclass

from core.base.command.move_command import MoveCommand
from core.modules.memories.models.memory import Memory
from core.modules.memories.models.lifecycles.memory_lifecycle import MemoryLifecycle


@dataclass(frozen=True)
class RemoveMemory(MoveCommand[Memory]):
    move = MemoryLifecycle.remove
    reason: str
