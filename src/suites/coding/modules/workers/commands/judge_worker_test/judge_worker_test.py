from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.workers.models.worker_test_request import WorkerTestRequest


@dataclass(frozen=True)
class JudgeWorkerTest(Command[WorkerTestRequest]):
    """The merger decides a worker's request to run one test."""

    request_id: int
    refusal_reason: str | None = None
