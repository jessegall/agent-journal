from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.messages.models.message import Message


@dataclass(frozen=True)
class RecordPeerMessage(Command[Message]):
    """Keep a message another agent session sent to this agent, in its environment's chat."""

    environment_id: int
    agent_id: int
    sender: str
    text: str
    key: str
