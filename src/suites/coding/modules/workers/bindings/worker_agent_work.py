from collections.abc import Mapping

from core.base.agent_work import AgentWork
from core.base.query.queries import Queries
from suites.coding.modules.workers.models.worker_work_review import WorkerWorkReview


class WorkerAgentWork(AgentWork):
    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def held(self) -> Mapping[int, str]:
        return {row.agent_id: row.status for row in self.queries.query(WorkerWorkReview).all_rows()}
