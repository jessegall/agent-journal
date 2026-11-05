from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.memories.models.memory_mark import MemoryMark


@dataclass(frozen=True)
class OpenMemoryMark(Command[MemoryMark]):
    """Opens a context mark for an agent at the percent its context window passed."""

    agent_id: int
    percent: int
