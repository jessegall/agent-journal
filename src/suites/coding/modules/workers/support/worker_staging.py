from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.support.staging import Staging


class WorkerStaging:
    """Reads what a commit of a worker would take: its started tasks against the proofs of its worktree."""

    def __init__(self, proofs: ProofQuery, tasks: TaskQuery) -> None:
        self.proofs, self.tasks = proofs, tasks

    def read(self, worktree: Worktree) -> Staging:
        return Staging.grouped(self.tasks.started_tasks(worktree.session_agent_id), tuple(self.proofs.worktree_proofs(worktree.id).all_rows()))
