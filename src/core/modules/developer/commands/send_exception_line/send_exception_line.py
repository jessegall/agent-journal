from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class SendExceptionLine(Command[None]):
    """Tells the running main agent about an exception that showed in the chat."""

    lock = False

    agent_id: int
    exception_id: int
