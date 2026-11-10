from dataclasses import dataclass

from engine.command.command import Command
from core.modules.messages.models.message import Message


@dataclass(frozen=True)
class TagMessage(Command[Message]):
    """Says what a file attached to a message shows, so it can be found later."""

    message_id: int
    file: str
    text: str
