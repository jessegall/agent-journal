from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.messages.models.message import Message


@dataclass(frozen=True)
class NoteMessageRead(Command[Message]):
    """Marks a delivered message read without selecting it as a request."""

    message_id: int
