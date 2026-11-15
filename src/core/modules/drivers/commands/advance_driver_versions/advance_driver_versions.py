from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class AdvanceDriverVersions(Command[None]):
    """Moves the driver version of every environment, as the journal boots or its modules sync, which may publish
    profiles or change a driver's table."""
