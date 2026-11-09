from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class StartWorkerTests(Command[None]):
    """Starts the queued tests of every worker on the run queue, which decides how many run at once."""

