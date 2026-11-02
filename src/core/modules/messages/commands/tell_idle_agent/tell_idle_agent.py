from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.messages.models.message import Message


@dataclass(frozen=True)
class TellIdleAgent(Command[Message | None]):
    """Tells the environment's idle main agent of the first message waiting for it."""

    environment_id: int
