from core.modules.tasks.models.enums.task_state import TaskState
from core.modules.tasks.models.task import Task
from core.modules.tasks.queries.task_query import TaskQuery
from engine.database.kept_rows import KeptRows
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from suites.coding.modules.workers.models.enums.proof_state import ProofState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.support.staging import Staging

CANCELLED_REASON = "the staging shows every cancelled task of the unit"


class WorkerStaging:
    """Reads what a commit of a worker would take: its started tasks against the proofs of its worktree, and
    the cancelled tasks that still have a shown proof there."""

    def __init__(self, proofs: ProofQuery, tasks: TaskQuery, queries: Queries, kept: KeptRows) -> None:
        self.proofs, self.tasks, self.queries, self.kept = proofs, tasks, queries, kept

    def read(self, worktree: Worktree) -> Staging:
        started = self.tasks.started_tasks(worktree.session_agent_id)
        proofs = self.proofs.worktree_rows(worktree.id)
        started_ids = {task.id for task in started}
        unstarted_ids = sorted({proof.task_id for proof in proofs if proof.state is ProofState.SHOWN and proof.task_id not in started_ids})
        return Staging.grouped(started, proofs, self.cancelled(unstarted_ids))

    def cancelled(self, task_ids: list[int]) -> tuple[Task, ...]:
        if not task_ids:
            return ()
        cancelled = self.queries.query(Task).matching(Among("id", task_ids)).filter(state=TaskState.CANCELLED).ordered("id")
        return self.kept.read(cancelled, lambda: tuple(cancelled.every_row(CANCELLED_REASON)), name="workers.cancelled_shown_tasks")
