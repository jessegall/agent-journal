from core.base.query.queries import Queries
from core.modules.plans.models.enums.plan_state import PlanState
from core.modules.plans.models.phase import Phase
from core.modules.plans.support.task_plans import TaskPlans
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.affected_test import AffectedTest, AffectedTestState
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery

HELD_BACK_TASK_STATES = (TaskState.STARTED, TaskState.TESTING)


class WorkerPhases:
    """Answers where a worker stands in a started plan: the phase a task is in, whether the next task is in that
    same phase, and whether the worker's own test runs are held back until the phase ends."""

    def __init__(self, queries: Queries, plans: TaskPlans, worktrees: WorktreeQuery, proofs: ProofQuery) -> None:
        self.queries, self.plans, self.worktrees, self.proofs = queries, plans, worktrees, proofs

    def phase(self, task: Task) -> Phase | None:
        plan = self.plans.find(task.id)
        if plan is None or plan.state is not PlanState.STARTED:
            return None
        return self.plans.find_phase(task.id)

    def continues(self, task: Task, following: Task | None) -> bool:
        phase = self.phase(task)
        return phase is not None and following is not None and self.phase(following) == phase

    def failure_out(self, worktree: Worktree) -> bool:
        if self.proofs.worktree_proofs(worktree.id).filter(state=ProofState.SHORT).exists():
            return True
        selected = self.queries.query(AffectedTest).filter(worktree_id=worktree.id).newest().first()
        return selected is not None and selected.state is AffectedTestState.FAILED

    def is_working_through_phase(self, worktree: Worktree) -> bool:
        task = self.queries.query(Task).find(worktree.task_id)
        return task.state is TaskState.STARTED and self.phase(task) is not None

    def holds_back(self, worker_id: int) -> bool:
        worktree = self.worktrees.worker_worktree(worker_id)
        if worktree is None:
            return False
        task = self.queries.query(Task).find(worktree.task_id)
        return task.state in HELD_BACK_TASK_STATES and self.phase(task) is not None and not self.failure_out(worktree)
