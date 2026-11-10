from dataclasses import dataclass

from engine.command.command import Command
from core.modules.messages.models.message import Message


@dataclass(frozen=True)
class RecordTypedPrompt(Command[Message]):
    """Keeps a prompt a person typed in the caller's terminal as the person's message in the chat."""

    lock = False

    text: str
