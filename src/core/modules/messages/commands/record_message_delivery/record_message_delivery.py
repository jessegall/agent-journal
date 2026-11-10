from dataclasses import dataclass

from engine.command.command import Command
from core.modules.messages.models.message import Message


@dataclass(frozen=True)
class RecordMessageDelivery(Command[Message]):
    """Keeps that the agent was told a message arrived, at the command's timestamp."""

    message_id: int
