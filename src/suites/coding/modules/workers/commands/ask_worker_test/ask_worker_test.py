from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.workers.models.worker_test_request import WorkerTestRequest


@dataclass(frozen=True)
class AskWorkerTest(Command[WorkerTestRequest]):
    """A worker asks to run one test command once."""

    worker_id: int
    task_id: int
    test_command: str
    reason: str
