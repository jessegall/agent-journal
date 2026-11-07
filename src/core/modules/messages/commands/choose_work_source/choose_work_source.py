from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.messages.models.message_work_source import MessageWorkSource


@dataclass(frozen=True)
class ChooseWorkSource(Command[MessageWorkSource]):
    """Explicitly selects an addressed person request."""

    message_id: int
