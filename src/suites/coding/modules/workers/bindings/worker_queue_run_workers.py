from engine.row.page import Page
from core.base.query.conditions.among import Among
from core.modules.processes.models.process import Process
from suites.coding.modules.workers.support.queue_run_workers import QueueRunWorkers
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.worktree import Worktree


class WorkerQueueRunWorkers(QueueRunWorkers):
    """Includes the originating worker when a proof test runs under the main agent."""

    def read(self, page: Page[Process]) -> dict[int, int]:
        owners = super().read(page)
        if not page.rows:
            return owners
        proofs = tuple(self.queries.query(Proof).matching(Among("process_id", tuple(process.id for process in page.rows))).limited(page.size))
        if not proofs:
            return owners
        worktree_ids = tuple({proof.worktree_id for proof in proofs})
        workers = {worktree.id: worktree.session_agent_id for worktree in self.queries.query(Worktree).matching(Among("id", worktree_ids)).limited(page.size)}
        for proof in proofs:
            worker_id = workers.get(proof.worktree_id)
            if worker_id is not None and proof.process_id is not None:
                owners[proof.process_id] = worker_id
        return owners
