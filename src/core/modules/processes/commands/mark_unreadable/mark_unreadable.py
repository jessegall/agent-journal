from dataclasses import dataclass

from engine.command.command import Command
from core.modules.processes.models.unreadable_mark import UnreadableMark


@dataclass(frozen=True)
class MarkUnreadable(Command[UnreadableMark]):
    """Marks a command, by its leading words, as one whose output no reader can read, with the agent's reason."""

    words: str
    reason: str
