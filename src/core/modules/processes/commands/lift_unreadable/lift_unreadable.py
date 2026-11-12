from dataclasses import dataclass

from engine.command.command import Command
from core.modules.processes.models.unreadable_mark import UnreadableMark


@dataclass(frozen=True)
class LiftUnreadable(Command[UnreadableMark]):
    """Lifts the mark of a command, by its leading words, so its runs are asked for a reader again."""

    words: str
