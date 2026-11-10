from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class HaltRunQueue(Command[str]):
    """Halts the queue of test runs: work still joins it, and no run is given a spot until the queue is resumed."""

    reason: str
