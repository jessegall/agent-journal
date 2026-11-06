from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.workers.models.worker_test_request import WorkerTestRequest


@dataclass(frozen=True)
class AllowWorkerTest(Command[WorkerTestRequest]):
    """Lets a worker run the test command of its request once."""

    request_id: int
