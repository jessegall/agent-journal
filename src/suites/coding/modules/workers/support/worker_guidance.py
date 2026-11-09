from core.base.query.queries import Queries
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.enums.worker_step import WorkerStep
from suites.coding.modules.workers.support.worker_groups import WorkerGroups
from suites.coding.modules.workers.support.worker_phases import WorkerPhases
from suites.coding.modules.workers.support.worker_point import WorkerPoint
from suites.coding.modules.workers.support.worker_round import WorkerRound
from suites.coding.modules.workers.support.worker_step_facts import WorkerStepFacts
from suites.coding.modules.workers.support.worker_step_text import step_line
from suites.coding.modules.workers.support.worker_steps import WorkerSteps

NEXT_COMMAND = 'journal worker next --differences "<what differs, or none>"'
DELIVER_COMMAND = 'journal worker deliver --differences "<what differs, or none>"'
WORK_LABEL = "your work"
CONFLICT_FILES_FIELD = "lines"


class WorkerGuidance:
    """What a worker should do now: the one source of every line that tells it."""

    def __init__(self, steps: WorkerSteps, groups: WorkerGroups, phases: WorkerPhases, queries: Queries) -> None:
        self.steps, self.groups, self.phases, self.queries = steps, groups, phases, queries

    def line(self, worker_id: int) -> str:
        return self.point(worker_id).line

    def point(self, worker_id: int) -> WorkerPoint:
        return self.round_point(self.steps.round(worker_id))

    def round_point(self, worker_round: WorkerRound) -> WorkerPoint:
        step = self.steps.step(worker_round)
        worktree = worker_round.worktree
        if worktree is None:
            return WorkerPoint(worker_round, step, step_line(step, self.no_work_facts(worker_round)), None, len(worker_round.started), None)
        group = worker_round.group
        open_task_count = self.groups.open_task_count(group, worker_round.started, worker_round.ready)
        runs = self.groups.test_runs_available(worktree, group)
        return WorkerPoint(worker_round, step, step_line(step, self.facts(worker_round, open_task_count, runs)), self.groups.group_key(group), open_task_count, runs)

    def conflict_line(self, task: Task, files: str) -> str:
        return step_line(WorkerStep.CONFLICT, WorkerStepFacts(task_id=task.id, open_task_count=0, test_runs_available=None, label=WORK_LABEL, deliver_command=DELIVER_COMMAND, conflict_files=files))

    def facts(self, worker_round: WorkerRound, open_task_count: int, runs: int | None) -> WorkerStepFacts:
        task = self.current_task(worker_round)
        worktree_task = self.queries.query(Task).find(worker_round.worktree.task_id)
        files = "" if worker_round.conflict is None else str(dict(worker_round.conflict.nudge.fields)[CONFLICT_FILES_FIELD])
        return WorkerStepFacts(task_id=task.id, open_task_count=open_task_count, test_runs_available=runs, label=self.phases.test_label(worktree_task), deliver_command=DELIVER_COMMAND if worker_round.following is None else NEXT_COMMAND, conflict_files=files, tests_waiting=self.steps.proofs.tests_waiting(worker_round.worktree.id))

    def current_task(self, worker_round: WorkerRound) -> Task:
        if worker_round.started:
            return worker_round.started[0]
        return worker_round.following if worker_round.following is not None else self.queries.query(Task).find(worker_round.worktree.task_id)

    @staticmethod
    def no_work_facts(worker_round: WorkerRound) -> WorkerStepFacts:
        return WorkerStepFacts(task_id=worker_round.started[0].id if worker_round.started else 0, open_task_count=len(worker_round.started), test_runs_available=None, label=WORK_LABEL, deliver_command=DELIVER_COMMAND)
