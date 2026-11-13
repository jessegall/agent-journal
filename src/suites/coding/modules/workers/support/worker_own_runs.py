from engine.query.queries import Queries
from core.modules.processes.models.process import Process
from suites.coding.modules.workers.models.proof import Proof


class WorkerOwnRuns:
    """Whether a run counts as an agent's own: one it started itself or the journal ran for one of its tasks, or the
    test of one of its proofs, which the journal starts for it."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def is_own(self, process: Process) -> bool:
        return process.is_agents_own_work or self.queries.query(Proof).filter(process_id=process.id).exists()
