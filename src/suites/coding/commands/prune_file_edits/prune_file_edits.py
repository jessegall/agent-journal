from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class PruneFileEdits(Command[None]):
    """Removes the oldest file edits of the environment past the newest 1000."""
