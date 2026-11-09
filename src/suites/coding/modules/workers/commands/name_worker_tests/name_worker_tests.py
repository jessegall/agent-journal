from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.workers.support.test_command_entry import TestCommandEntry


@dataclass(frozen=True)
class NameWorkerTests(Command[None]):
    """Gives a worker test commands by name, replacing a name it already has."""

    worker_id: int
    commands: tuple[TestCommandEntry, ...]
