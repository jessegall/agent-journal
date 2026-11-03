from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class GrantRunSlots(Command[None]):
    """Gives the queued runs the spots that are free, oldest first, unless the queue is halted."""
