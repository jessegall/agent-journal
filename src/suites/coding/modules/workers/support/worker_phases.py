from engine.database.kept_rows import KeptRows
from engine.query.queries import Queries
from engine.query.conditions.among import Among
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.support.worker_test_group import WorkerTestGroup
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.phase import Phase
from core.modules.plans.models.plan import Plan
from core.modules.plans.support.task_plans import TaskPlans
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.affected_test import AffectedTest, AffectedTestState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery

WAITING_TASK_STATES = (TaskState.STARTED, TaskState.TESTING)
PHASE_TESTS_RUN = False
BATCH_SIZE = 1


class WorkerPhases:
    """Grouped a worker's pending tests by phase or by a number of tasks. Tests run at checkpoints now, so no
    phase has a test at its end and no batch is made: nothing is grouped."""

    def __init__(self, queries: Queries, plans: TaskPlans, worktrees: WorktreeQuery, proofs: ProofQuery, settings: SettingValues, kept: KeptRows) -> None:
        self.queries, self.plans, self.worktrees, self.proofs, self.settings, self.kept = queries, plans, worktrees, proofs, settings, kept

    def phase(self, task: Task) -> Phase | None:
        if not PHASE_TESTS_RUN:
            return None
        phase = self.plans.find_phase(task.id)
        if phase is None or self.queries.query(Plan).find(phase.plan_id).state is not PlanState.STARTED:
            return None
        return phase

    def continues(self, task: Task, following: Task | None) -> bool:
        phase = self.phase(task)
        return phase is not None and following is not None and self.phase(following) == phase

    def group(self, worktree: Worktree, task: Task) -> WorkerTestGroup | None:
        plan = self.plans.find(task.id)
        if plan is not None:
            if self.is_phase_grouped(plan):
                phase = self.plans.find_phase(task.id)
                return None if phase is None else WorkerTestGroup(phase, ())
            return None
        if BATCH_SIZE <= 1:
            return None
        tasks = self.queries.query(Task).filter(delegated_to=worktree.session_agent_id).matching(Among("state", WAITING_TASK_STATES)).oldest().all_rows()
        return WorkerTestGroup(None, tuple(tasks))

    def continues_group(self, group: WorkerTestGroup, following: Task) -> bool:
        if group.phase is not None:
            return self.phase(following) == group.phase
        return len(group.tasks) < BATCH_SIZE and self.plans.find(following.id) is None

    def continues_with(self, worktree: Worktree, following: Task | None) -> bool:
        group = self.group(worktree, self.queries.query(Task).find(worktree.task_id))
        return following is not None and group is not None and self.continues_group(group, following)

    def is_grouped(self, task: Task) -> bool:
        plan = self.plans.find(task.id)
        if plan is not None:
            return self.is_phase_grouped(plan)
        return BATCH_SIZE > 1

    def test_label(self, task: Task) -> str:
        phase = self.phase(task)
        if phase is not None:
            return f"phase {phase.id}"
        return "batch" if self.is_grouped(task) else f"task {task.id}"

    def is_phase_grouped(self, plan: Plan) -> bool:
        return plan.state is PlanState.STARTED and PHASE_TESTS_RUN

    def has_open_failure(self, worktree: Worktree) -> bool:
        if self.proofs.has_short_proof(worktree.id):
            return True
        first_answer = self.queries.query(AffectedTest).filter(worktree_id=worktree.id).newest().first()
        return first_answer is not None and first_answer.state is AffectedTestState.FAILED

    def has_group_flow(self, worktree: Worktree) -> bool:
        task = self.queries.query(Task).find(worktree.task_id)
        return task.state is TaskState.STARTED and self.is_grouped(task)

    def advanced(self, worker_id: int) -> tuple[Task, ...]:
        testing = self.kept.scoped_current(lambda: tuple(self.queries.query(Task).filter(delegated_to=worker_id, state=TaskState.TESTING).oldest().all_rows()),
                                           name=f"workers.testing_tasks:{worker_id}")
        self.plans.prepare([task.id for task in testing])
        return tuple(task for task in testing if self.is_grouped(task))

    def committed(self, worker_id: int) -> tuple[Task, ...]:
        testing = self.kept.scoped_current(lambda: tuple(self.queries.query(Task).filter(delegated_to=worker_id, state=TaskState.TESTING).oldest().all_rows()),
                                           name=f"workers.testing_tasks:{worker_id}")
        self.plans.prepare([task.id for task in testing])
        return tuple(task for task in testing if self.plans.is_started_plan(task.id))

    def has_phase_wait(self, worker_id: int) -> bool:
        return self.waiting_group(worker_id) is not None

    def has_delivered(self, worker_id: int) -> bool:
        worktree = self.worktrees.worker_worktree(worker_id)
        return worktree is not None and self.queries.query(Task).find(worktree.task_id).state is TaskState.TESTING

    def waiting_group(self, worker_id: int) -> WorkerTestGroup | None:
        worktree = self.worktrees.worker_worktree(worker_id)
        if worktree is None:
            return None
        task = self.queries.query(Task).find(worktree.task_id)
        if task.state not in WAITING_TASK_STATES or self.has_open_failure(worktree):
            return None
        return self.group(worktree, task)
