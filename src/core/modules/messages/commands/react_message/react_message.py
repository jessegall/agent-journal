from dataclasses import dataclass

from engine.command.command import Command
from core.modules.messages.models.message import Message


@dataclass(frozen=True)
class ReactMessage(Command[Message]):
    lock = True

    message_id: int
    emoji: str
