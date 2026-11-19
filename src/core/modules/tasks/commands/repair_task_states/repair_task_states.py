from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RepairTaskStates(Command[int]):
    """Repairs task states that should never exist: a wait on a task that has ended, and a holder left on an
    open task; answers how many it repaired."""

    lock = True
