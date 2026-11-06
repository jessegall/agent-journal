from dataclasses import dataclass

from core.base.model.model import Model
from suites.coding.modules.workers.models.enums.worker_test_request_state import WorkerTestRequestState
from suites.coding.modules.workers.models.lifecycles.worker_test_request_lifecycle import WorkerTestRequestLifecycle


@dataclass(frozen=True, kw_only=True)
class WorkerTestRequest(Model):
    """A worker's request to run one test command once in the middle of a phase."""

    model_name = "worker_test_request"
    cli_name = "worker-test-request"
    lifecycle = WorkerTestRequestLifecycle

    worker_id: int
    task_id: int
    command: str
    reason: str
    state: WorkerTestRequestState = WorkerTestRequestState.REQUESTED
