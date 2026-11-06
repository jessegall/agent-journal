from dataclasses import dataclass

from core.base.page import Page
from core.modules.plans.models.phase import Phase
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.proof import Proof


@dataclass(frozen=True)
class WorkerStatusPhase:
    """The phase of a worker's current task and how many of its tasks wait for that phase's end."""

    phase: Phase
    tasks_waiting: int


@dataclass(frozen=True)
class WorkerStatus:
    worker_id: int
    current_task: Task
    tests: Page[Proof]
    assignments: Page[Task]
    skills: tuple[str, ...]
    phase: WorkerStatusPhase | None = None
