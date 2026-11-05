from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.memories.models.memory import Memory


@dataclass(frozen=True)
class MakeMemory(Command[Memory]):
    """Makes a memory in the caller's environment, or for the calling helper alone, with its keywords."""

    text: str
    type: str
    weight: int | None = None
    keywords: tuple[str, ...] = ()
    task_id: int | None = None
    personal: bool = False
