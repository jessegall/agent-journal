from suites.coding.modules.workers.support.work_units import WorkUnits
from core.modules.assignments.support.assignments import Assignments
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.models.enums.worker_step import WorkerStep
from suites.coding.modules.workers.support.commit_window import CommitWindow
from core.modules.plans.support.task_plans import TaskPlans
from suites.coding.modules.workers.support.worker_point import WorkerPoint
from suites.coding.modules.workers.support.worker_round import WorkerRound
from suites.coding.modules.workers.support.checkpoint_wait_text import CheckpointWaitText
from suites.coding.modules.workers.support.worker_step_facts import WorkerStepFacts
from suites.coding.modules.workers.support.worker_step_text import step_line
from suites.coding.modules.workers.support.worker_steps import WorkerSteps
from suites.coding.modules.workers.support.worker_test_names import WorkerTestNames

WORK_LABEL = "your work"
CONFLICT_FILES_FIELD = "lines"


class WorkerGuidance:
    """What a worker should do now: the one source of every line that tells it."""

    def __init__(self, steps: WorkerSteps, window: CommitWindow, plans: TaskPlans, queries: Queries, names: WorkerTestNames, checkpoint_wait: CheckpointWaitText, assignments: Assignments,
                 units: WorkUnits) -> None:
        self.assignments, self.units = assignments, units
        self.steps, self.window, self.plans, self.queries, self.names, self.checkpoint_wait = steps, window, plans, queries, names, checkpoint_wait

    def line(self, worker_id: int) -> str:
        return self.point(worker_id).line

    def task_line(self, task: Task) -> str:
        worker_id = self.assignments.actor(task)
        if worker_id is None:
            raise Refusal(f"task {task.id} is delegated to no worker", "journal task show <n> shows which agent has it")
        return self.line(worker_id)

    def point(self, worker_id: int) -> WorkerPoint:
        return self.round_point(self.steps.round(worker_id))

    def round_point(self, worker_round: WorkerRound) -> WorkerPoint:
        step = self.steps.step(worker_round)
        worktree = worker_round.worktree
        if worktree is None:
            return WorkerPoint(worker_round, step, step_line(step, self.no_work_facts(worker_round)), None, len(worker_round.started), None)
        open_task_count = len(worker_round.started)
        runs = self.window.test_runs_available(worktree) if self.names.rows(worktree.session_agent_id) else 0
        return WorkerPoint(worker_round, step, step_line(step, self.facts(worker_round, worktree, open_task_count, runs)), self.window.key(worktree), open_task_count, runs)

    def question_line(self, worker_round: WorkerRound) -> str:
        return step_line(WorkerStep.QUESTION, self.no_work_facts(worker_round))

    def conflict_line(self, task: Task, files: str) -> str:
        return step_line(WorkerStep.CONFLICT, WorkerStepFacts(task_id=task.id, open_task_count=0, test_runs_available=None, label=WORK_LABEL, conflict_files=files))

    def facts(self, worker_round: WorkerRound, worktree: Worktree, open_task_count: int, runs: int | None) -> WorkerStepFacts:
        task = self.current_task(worker_round)
        staging = worker_round.required_staging()
        worktree_task = self.queries.query(Task).find(worktree.task_id)
        files = "" if worker_round.conflict is None else str(dict(worker_round.conflict.nudge.fields)[CONFLICT_FILES_FIELD])
        return WorkerStepFacts(task_id=task.id, open_task_count=open_task_count, test_runs_available=runs, label=f"task {worktree_task.id}", conflict_files=files, tests_waiting=self.steps.proofs.tests_waiting(worktree.id),
                               checkpoint_wait=self.checkpoint_wait.text(worktree), ready_task_ids=tuple(ready.id for ready in staging.ready), open_task_ids=tuple(opened.id for opened in staging.open_tasks),
                               missing=staging.missing_points(task.id), is_planned=self.plans.is_started_plan(task.id), unit_open_count=self.unit_open_count(worktree))

    def unit_open_count(self, worktree: Worktree) -> int | None:
        unit = self.units.unit(worktree.session_agent_id)
        return unit.open_count if unit.has_several_tasks else None

    def current_task(self, worker_round: WorkerRound) -> Task:
        if worker_round.started:
            return worker_round.started[0]
        return worker_round.following if worker_round.following is not None else self.queries.query(Task).find(worker_round.required_worktree().task_id)

    @staticmethod
    def no_work_facts(worker_round: WorkerRound) -> WorkerStepFacts:
        return WorkerStepFacts(task_id=worker_round.started[0].id if worker_round.started else 0, open_task_count=len(worker_round.started), test_runs_available=None, label=WORK_LABEL)
