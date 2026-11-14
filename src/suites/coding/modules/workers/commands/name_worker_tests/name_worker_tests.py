from dataclasses import dataclass

from engine.command.command import Command
from suites.coding.modules.workers.support.worker_test_command_entry import WorkerTestCommandEntry


@dataclass(frozen=True)
class NameWorkerTests(Command[None]):
    """Gives a worker test commands by name, replacing a name it already has."""

    worker_id: int
    commands: tuple[WorkerTestCommandEntry, ...]
