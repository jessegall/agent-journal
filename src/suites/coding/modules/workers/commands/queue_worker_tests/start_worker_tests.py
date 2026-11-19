from dataclasses import dataclass

from engine.command.command import Command
from suites.coding.modules.workers.support.worker_test_plan import WorkerTestPlan


@dataclass(frozen=True)
class StartWorkerTests(Command[None]):
    """Starts the worker tests planned, with their checkouts made, before this write; the run queue decides how
    many run at once."""

    plan: WorkerTestPlan
