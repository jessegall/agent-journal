from dataclasses import dataclass

from engine.command.command import Command
from core.modules.messages.models.message import Message


@dataclass(frozen=True)
class ReactMessage(Command[Message]):
    message_id: int
    emoji: str
