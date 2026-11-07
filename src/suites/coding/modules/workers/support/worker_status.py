from dataclasses import dataclass

from core.base.page import Page
from core.modules.tasks.models.task import Task
from core.modules.helpers.support.program_state import ProgramState
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.support.worker_status_phase import WorkerStatusPhase


@dataclass(frozen=True)
class WorkerStatus:
    worker_id: int
    current_task: Task
    tests: Page[Proof]
    assignments: Page[Task]
    skills: tuple[str, ...]
    phase: WorkerStatusPhase | None
    program: str
    program_state: ProgramState | None
