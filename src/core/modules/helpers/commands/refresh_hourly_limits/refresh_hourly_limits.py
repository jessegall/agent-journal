from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RefreshHourlyLimits(Command[None]):
    """Starts the new clock hour of each hourly budget of a program from what its window holds now."""

    program: str
