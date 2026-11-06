from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.workers.models.worker_test_request import WorkerTestRequest


@dataclass(frozen=True)
class RestoreWorkerTests(Command[tuple[WorkerTestRequest, ...]]):
    """Gives back the permission a run used when the run was stopped before it started."""

    process_id: int
