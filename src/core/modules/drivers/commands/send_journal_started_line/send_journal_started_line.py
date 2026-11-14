from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class SendJournalStartedLine(Command[None]):
    """Tells a running main agent that the journal has started."""

    lock = False

    agent_id: int
