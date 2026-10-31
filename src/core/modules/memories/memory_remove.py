from dataclasses import dataclass

from core.base.command.move_command import MoveCommand
from core.modules.memories.memory import Memory
from core.modules.memories.memory_lifecycle import MemoryLifecycle


@dataclass(frozen=True)
class MemoryRemove(MoveCommand[Memory]):
    move = MemoryLifecycle.remove
    reason: str
