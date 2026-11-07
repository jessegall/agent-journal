from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.workers.models.worker_test_request import WorkerTestRequest


@dataclass(frozen=True)
class UseWorkerTest(Command[WorkerTestRequest]):
    """Records that a worker ran the test command it was allowed to run once."""

    request_id: int
