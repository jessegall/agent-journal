from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.messages.message import Message


@dataclass(frozen=True)
class MessageSend(Command[Message]):
    """Writes a message in the caller's environment, as the caller; with a parent it is a reply to that message."""

    text: str
    parent_id: int | None = None


@dataclass(frozen=True)
class MessageRead(Command[Message]):
    """Marks a message read at the command's timestamp."""

    message_id: int
