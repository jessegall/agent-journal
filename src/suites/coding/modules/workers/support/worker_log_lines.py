from engine.query.conditions.among import Among
from engine.query.queries import Queries
from core.modules.tasks.models.task import Task
from core.modules.tasks.models.task_log import TaskLog
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.support.worker_review import WorkerReview
from suites.coding.modules.workers.support.worker_test_failures import WorkerTestFailures

REVIEW_REASON = "the review of a worker reads every task and log line of its worktree"



class WorkerLogLines:
    """Reads what the main agent reviews of a worker before it merges: the tasks of the work it has handed in."""

    def __init__(self, queries: Queries, failures: WorkerTestFailures, proofs: ProofQuery) -> None:
        self.queries, self.failures, self.proofs = queries, failures, proofs

    def review(self, worktree: Worktree) -> WorkerReview:
        proofs = self.proofs.worktree_rows(worktree.id)
        task_ids = sorted({worktree.task_id, *(proof.task_id for proof in proofs)})
        tasks = tuple(self.queries.query(Task).matching(Among("id", task_ids)).every_row(REVIEW_REASON))
        rows = self.queries.query(TaskLog).filter(creator_id=worktree.session_agent_id).matching(Among("task_id", task_ids)).every_row(REVIEW_REASON)
        return WorkerReview(tasks, tuple(rows), self.failures.flagged_lines(task_ids), proofs)
