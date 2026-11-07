from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class PruneProcesses(Command[int]):
    """Removes ended processes beyond an environment's retention limit."""

