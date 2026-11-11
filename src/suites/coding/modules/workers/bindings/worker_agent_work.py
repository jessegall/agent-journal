from suites.coding.modules.workers.support.work_units import WorkUnits
from collections.abc import Mapping

from engine.agent.agent_work import AgentWork
from engine.database.kept_rows import KeptRows
from engine.query.queries import Queries
from suites.coding.modules.workers.models.worker_work_review import WorkerWorkReview


class WorkerAgentWork(AgentWork):
    def __init__(self, queries: Queries, kept: KeptRows, units: WorkUnits) -> None:
        self.queries, self.kept, self.units = queries, kept, units

    def unit_name(self, agent_id: int) -> str:
        return self.units.unit(agent_id).card_name

    def pending(self) -> Mapping[int, str]:
        return self.kept.scoped_current(self.read, name="workers.pending_work")

    def read(self) -> Mapping[int, str]:
        return {row.agent_id: row.status for row in self.queries.query(WorkerWorkReview).all_rows()}
