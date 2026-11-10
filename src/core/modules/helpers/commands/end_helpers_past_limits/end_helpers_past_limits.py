from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class EndHelpersPastLimits(Command[None]):
    """Warns about each helper near its time or cost limit, and stops each one past it."""

    lock = False
