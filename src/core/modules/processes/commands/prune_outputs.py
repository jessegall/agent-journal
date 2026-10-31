from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class PruneOutputs(Command[int]):
    """Prunes the oldest kept outputs past the number the settings keep, and gives how many it pruned."""

    environment_id: int
