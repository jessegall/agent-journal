from dataclasses import dataclass

from engine.model.model import Model


@dataclass(frozen=True, kw_only=True)
class WorkerTestRun(Model):
    """One test command a worker ran from its allowance in a phase or batch."""

    model_name = "worker_test_run"
    cli_name = "worker-test-run"

    worker_id: int
    group_key: str
