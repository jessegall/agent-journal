from dataclasses import dataclass

from engine.model.model import Model
from suites.coding.modules.workers.models.enums.test_failure_source import TestFailureSource


@dataclass(frozen=True, kw_only=True)
class WorkerTestFailure(Model):
    """One failed hand-in or one failed test a worker ran itself, on one task."""

    model_name = "worker_test_failure"
    cli_name = "worker-test-failure"

    worker_id: int
    task_id: int
    source: TestFailureSource
    test_name: str
