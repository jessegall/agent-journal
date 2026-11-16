from dataclasses import dataclass

from engine.command.command import Command
from core.modules.messages.models.message import Message


@dataclass(frozen=True)
class RecordMessageDelivery(Command[list[Message]]):
    """Keeps that the agent was told the messages arrived, at the command's timestamp, in one write."""

    messages: tuple[Message, ...]
