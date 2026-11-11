from dataclasses import dataclass

from engine.row.page import Page
from core.modules.agents.models.enums.standing_state import StandingState
from core.modules.tasks.models.task import Task
from core.modules.helpers.support.program_state import ProgramState
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worker_step_facts import run_count_text
from core.modules.tasks.models.enums.task_state import TaskState
from suites.coding.modules.workers.support.staging import Staging
from suites.coding.modules.workers.support.worker_point import WorkerPoint


@dataclass(frozen=True)
class WorkerStatus:
    worker_id: int
    worker_number: int
    worktree: Worktree
    current_task: Task
    started_tasks: tuple[Task, ...]
    staging: Staging
    waiting_tasks: tuple[Task, ...]
    startable_tasks: tuple[Task, ...]
    tests: Page[Proof]
    assignments: Page[Task]
    skills: tuple[str, ...]
    program: str
    program_state: ProgramState | None
    point: WorkerPoint
    is_paused: bool
    question_lines: tuple[str, ...]
    standing: StandingState

    @property
    def blocked_tasks(self) -> tuple[Task, ...]:
        return tuple(task for task in self.assignments.rows if task.state is TaskState.BLOCKED)

    def group_lines(self) -> tuple[str, ...]:
        open_lines = tuple(self.staging.open_task_line(task) for task in self.staging.open_tasks)
        return (f"Tasks held: {len(open_lines)}", *(f"  {line}" for line in open_lines),
                f"Tasks staged: {len(self.staging.ready)}", *(f"  task {task.id}: {task.title}" for task in self.staging.ready),
                f"Tasks waiting for tests: {len(self.waiting_tasks)}", *(f"  task {task.id}: {task.title}" for task in self.waiting_tasks),
                f"Tasks you may start: {len(self.startable_tasks)}", *(f"  task {task.id}: {task.title}" for task in self.startable_tasks),
                f"Tasks blocked: {len(self.blocked_tasks)}", *(f"  task {task.id}: {task.reason}" for task in self.blocked_tasks))

    @property
    def runs_text(self) -> str:
        return run_count_text(self.point.test_runs_available)
