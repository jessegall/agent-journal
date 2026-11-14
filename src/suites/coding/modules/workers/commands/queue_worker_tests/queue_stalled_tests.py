from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class QueueStalledTests(Command[None]):
    """Queues the test of each proof whose task is in testing while none of its worker's tests waits or runs."""
