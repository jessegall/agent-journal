from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.processes.models.process import Process


@dataclass(frozen=True)
class RunWorkerTest(Command[Process]):
    """Runs one of a worker's named test commands in its worktree."""

    name: str
    test_arguments: tuple[str, ...]
