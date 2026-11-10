from collections.abc import Mapping

from engine.agent.agent_work import AgentWork
from core.base.database.kept_rows import KeptRows
from core.base.query.queries import Queries
from suites.coding.modules.workers.models.worker_work_review import WorkerWorkReview


class WorkerAgentWork(AgentWork):
    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def pending(self) -> Mapping[int, str]:
        return self.kept.scoped_current(self.read, name="workers.pending_work")

    def read(self) -> Mapping[int, str]:
        return {row.agent_id: row.status for row in self.queries.query(WorkerWorkReview).all_rows()}
