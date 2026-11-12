from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class PruneBehindChecks(Command[int]):
    """Removes the closed checks of the environment in scope older than the days they are kept."""
