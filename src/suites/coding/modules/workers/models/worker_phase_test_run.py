from dataclasses import dataclass

from core.base.model.model import Model


@dataclass(frozen=True, kw_only=True)
class WorkerPhaseTestRun(Model):
    """One test command a worker ran from its allowance in a phase."""

    model_name = "worker_phase_test_run"
    cli_name = "worker-phase-test-run"

    worker_id: int
    phase_id: int
