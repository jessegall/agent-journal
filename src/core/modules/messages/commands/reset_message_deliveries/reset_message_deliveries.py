from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.messages.models.message import Message


@dataclass(frozen=True)
class ResetMessageDeliveries(Command[tuple[Message, ...]]):
    """Counts the unread messages a hook's answer told of as not delivered, since that answer never reached the
    agent."""

    hook_call_id: int
