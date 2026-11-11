from dataclasses import dataclass

from engine.row.page import Page
from core.modules.tasks.models.task import Task
from core.modules.helpers.support.program_state import ProgramState
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worker_step_facts import run_count_text
from suites.coding.modules.workers.support.worker_status_phase import WorkerStatusPhase
from suites.coding.modules.workers.support.worker_point import WorkerPoint


@dataclass(frozen=True)
class WorkerStatus:
    worker_id: int
    worker_number: int
    worktree: Worktree
    current_task: Task
    tests: Page[Proof]
    assignments: Page[Task]
    skills: tuple[str, ...]
    phase: WorkerStatusPhase | None
    program: str
    program_state: ProgramState | None
    point: WorkerPoint
    is_paused: bool
    question_lines: tuple[str, ...]

    @property
    def runs_text(self) -> str:
        return run_count_text(self.point.test_runs_available)
