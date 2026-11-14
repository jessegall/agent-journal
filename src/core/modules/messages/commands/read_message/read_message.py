from dataclasses import dataclass
from engine.command.command import Command
from core.modules.messages.models.message import Message


@dataclass(frozen=True)
class ReadMessage(Command[Message]):
    """Marks a message read at the command's timestamp."""

    message_id: int
