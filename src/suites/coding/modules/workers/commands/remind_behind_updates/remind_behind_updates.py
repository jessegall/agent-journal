from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RemindBehindUpdates(Command[None]):
    """Reminds the workers of the environment in scope of an ordered update they have not run, then tells the merger."""
