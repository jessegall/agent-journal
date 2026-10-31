from dataclasses import dataclass

from core.base.command.command import Command
from core.base.timestamp import Timestamp
from core.modules.memories.memory import Memory


@dataclass(frozen=True)
class MakeMemory(Command[Memory]):
    """Makes a memory in the caller's environment, for the whole project or for the calling helper alone, with its
    keywords."""

    text: str
    type: str
    weight: int | None = None
    keywords: tuple[str, ...] = ()
    task_id: int | None = None
    due_at: Timestamp | None = None
    project: bool = False
    personal: bool = False
