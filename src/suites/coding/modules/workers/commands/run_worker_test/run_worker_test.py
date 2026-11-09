from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.workers.support.worker_test_run import WorkerTestRun


@dataclass(frozen=True)
class RunWorkerTest(Command[WorkerTestRun]):
    """Runs one of a worker's named test commands in its worktree."""

    name: str
    test_arguments: tuple[str, ...]
    piped: bool = False
