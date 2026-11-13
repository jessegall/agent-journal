from engine.query.prunable import Prunable
from dataclasses import dataclass

from engine.model.model import Model
from suites.coding.modules.workers.models.enums.failed_test_source import FailedTestSource


@dataclass(frozen=True, kw_only=True)
class WorkerTestFailure(Prunable, Model):
    """One failed hand-in or one failed test a worker ran itself, on one task."""

    kept_rows = 5000

    model_name = "worker_test_failure"
    cli_name = "worker-test-failure"

    worker_id: int
    task_id: int
    source: FailedTestSource
    test_name: str
