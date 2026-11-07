from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.workers.models.worker_phase_test_run import WorkerPhaseTestRun


@dataclass(frozen=True)
class RecordWorkerPhaseTestRun(Command[WorkerPhaseTestRun]):
    """Records one test command used from a worker's phase allowance."""

    worker_id: int
    phase_id: int
