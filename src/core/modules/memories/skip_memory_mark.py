from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.memories.memory_mark import MemoryMark


@dataclass(frozen=True)
class SkipMemoryMark(Command[MemoryMark]):
    """Closes the calling agent's open mark as skipped, with why nothing needs keeping."""

    reason: str
