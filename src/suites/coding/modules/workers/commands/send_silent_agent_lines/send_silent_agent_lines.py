from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class SendSilentAgentLines(Command[None]):
    """Sends waking lines to silent agents with unfinished work."""

