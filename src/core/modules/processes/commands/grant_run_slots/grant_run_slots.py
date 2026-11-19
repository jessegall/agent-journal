from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class GrantRunSlots(Command[None]):
    """Gives the queued runs the spots that are free, oldest first, unless the queue is halted. It locks, since it
    admits runs it read while their own commands may change them."""

    lock = True
