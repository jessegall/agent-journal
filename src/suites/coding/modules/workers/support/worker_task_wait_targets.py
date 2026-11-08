from suites.coding.support.coding_helper_kind import CodingHelperKind
from core.base.command.context import Context
from core.base.database.database import Database
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.modules.agents.models.agent import Agent
from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.support.task_wait_targets import TaskWaitTargets
from core.modules.tasks.support.task_waits import TaskWaits
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery


class WorkerTaskWaitTargets(TaskWaitTargets):
    """Validates worker wait targets and resolves them after the worker finishes."""

    def __init__(self, database: Database, queries: Queries, worktrees: WorktreeQuery, proofs: ProofQuery, waits: TaskWaits) -> None:
        super().__init__(database, queries)
        self.queries, self.worktrees, self.proofs, self.waits = queries, worktrees, proofs, waits

    @property
    def target_types(self) -> tuple[str, ...]:
        return (*super().target_types, "worker")

    def target(self, target_type: str, row_id: int) -> str:
        if target_type != "worker":
            return super().target(target_type, row_id)
        worker = self.queries.query(Agent).filter(id=row_id).first()
        if worker is None:
            raise Refusal(f"worker {row_id} does not exist", "name an existing worker")
        if worker.role != CodingHelperKind.WORKER:
            raise Refusal(f"agent {row_id} is not a worker", "name a worker")
        if self.is_finished(worker):
            raise Refusal(f"worker {row_id} has already finished", "nothing waits on it; carry on with the task")
        return f"workers:{row_id}"

    def helper_target(self, row_id: int) -> str:
        return self.target("worker", row_id) if self.queries.query(Agent).find(row_id).role == CodingHelperKind.WORKER else super().helper_target(row_id)

    def is_finished(self, worker: Agent) -> bool:
        worktree = self.worktrees.worker_worktree(worker.id)
        if worktree is None or worktree.state in (WorktreeState.MERGED, WorktreeState.ABANDONED, WorktreeState.REMOVED):
            return True
        if self.proofs.tests_waiting(worktree.id) or self.proofs.worktree_proofs(worktree.id).filter(state=ProofState.SHORT).exists():
            return False
        if worker.ended_at is None or self.queries.query(Task).filter(delegated_to=worker.id, state=TaskState.OPEN).exists():
            return False
        task = self.queries.query(Task).find(worktree.task_id)
        return task.started_at is None or task.started_at.value <= worker.ended_at.value

    def resolve_waits(self, worker_id: int, context: Context) -> None:
        waits = self.waits.pending_target(f"workers:{worker_id}")
        if not waits or not self.is_finished(self.queries.query(Agent).find(worker_id)):
            return
        self.waits.resolved(waits, context)
