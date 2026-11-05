from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.memories.models.memory import Memory


@dataclass(frozen=True)
class MakeMemory(Command[Memory]):
    """Makes a memory that belongs to the agent that runs it, with its keywords."""

    text: str
    weight: int | None = None
    keywords: tuple[str, ...] = ()
    task_id: int | None = None
