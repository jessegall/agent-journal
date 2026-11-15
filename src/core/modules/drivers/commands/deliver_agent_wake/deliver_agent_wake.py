from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class DeliverAgentWake(Command[None]):
    """Takes one due wake obligation through its next move, in its own write (doc 1310 section 6.4)."""

    wake_id: int
