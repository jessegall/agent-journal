from dataclasses import dataclass

from engine.command.command import Command
from core.modules.processes.models.unreadable_mark import UnreadableMark


@dataclass(frozen=True)
class LiftRunUnreadable(Command[UnreadableMark]):
    """A person lifts the mark of the command of a run, from its card."""

    process_id: int
