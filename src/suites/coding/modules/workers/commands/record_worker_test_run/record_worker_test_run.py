from dataclasses import dataclass

from engine.command.command import Command
from suites.coding.modules.workers.models.worker_test_run import WorkerTestRun


@dataclass(frozen=True)
class RecordWorkerTestRun(Command[WorkerTestRun]):
    """Records one test command used from a worker's phase or batch allowance."""

    worker_id: int
    group_key: str
