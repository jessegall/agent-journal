from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class SendReaderRequestNotice(Command[None]):
    """Sends a reader request notice to the idle main agent."""

    agent_id: int
    request_id: int
