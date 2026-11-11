from dataclasses import dataclass

from engine.command.command import Command
from core.modules.processes.models.unreadable_mark import UnreadableMark


@dataclass(frozen=True)
class MarkRunUnreadable(Command[UnreadableMark]):
    """A person marks the command of a run, from its card, as one whose output no reader can read."""

    process_id: int
