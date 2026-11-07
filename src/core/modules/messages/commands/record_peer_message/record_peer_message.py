from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.messages.models.message import Message


@dataclass(frozen=True)
class RecordPeerMessage(Command[Message]):
    """Keep a message another agent sent to this agent, or this agent sent to another, in its environment's chat."""

    lock = False

    agent_id: int
    sender: str
    text: str
    key: str
    outgoing: bool = False
