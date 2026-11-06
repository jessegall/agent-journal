from datetime import timedelta

from core.base.clock import Clock
from core.base.database.kept_rows import KeptRows
from core.base.query.conditions.greater import Greater
from core.base.timestamp import Timestamp
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.scope.scopes import Scopes
from core.modules.agents.models.agent import AGENTS_TABLE, Agent
from core.modules.agents.support.agent_type_limits import NO_LIMIT, AgentTypeLimits
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from suites.coding.modules.workers.support.worker_job import RESUMING_SOURCES
from suites.coding.support.coding_agent_role import CodingAgentRole

JOB_DELIVERY_SECONDS = 120


class WorkerPlaces:
    """How many workers run against the run limit. A run place is a process that has not ended, or a resume handed
    over in the last two minutes that has not bound yet: delivered work with its process stopped takes no run place."""

    def __init__(self, queries: Queries, limits: AgentTypeLimits, kept: KeptRows, clock: Clock, scopes: Scopes) -> None:
        self.queries, self.limits, self.kept, self.clock, self.scopes = queries, limits, kept, clock, scopes

    def running(self) -> tuple[Agent, ...]:
        return self.kept.read(AGENTS_TABLE, self.running_rows, "role = ?", [CodingAgentRole.WORKER.value], name="workers.running")

    def running_rows(self) -> tuple[Agent, ...]:
        return tuple(self.queries.query(Agent).filter(role=CodingAgentRole.WORKER).matching(IsNull("ended_at")).all_rows())

    def kept_workers(self) -> tuple[Agent, ...]:
        return self.kept.read(AGENTS_TABLE, self.kept_rows, "role = ?", [CodingAgentRole.WORKER.value], name="workers.kept")

    def kept_rows(self) -> tuple[Agent, ...]:
        return tuple(self.queries.query(Agent).filter(role=CodingAgentRole.WORKER).matching(IsNull("retired_at")).newest().all_rows())

    def kept_limit(self) -> int:
        return self.limits.of(CodingAgentRole.WORKER).kept

    def has_kept_place(self) -> bool:
        return self.kept_limit() == NO_LIMIT or len(self.kept_workers()) < self.kept_limit()

    def run_limit(self) -> int:
        return self.limits.of(CodingAgentRole.WORKER).run

    def resuming_count(self) -> int:
        cutoff_at = Timestamp(self.clock.timestamp().value - timedelta(seconds=JOB_DELIVERY_SECONDS)).text
        entered = self.queries.query(AgentLine).filter(state=AgentLineState.ENTERED).matching(Greater("updated_at", cutoff_at))
        running_ids = {worker.id for worker in self.running()}
        workers = {worker.id: worker for worker in self.queries.query(Agent).filter(role=CodingAgentRole.WORKER).matching(IsNull("retired_at")).all_rows()}
        return len({line.session_agent_id for line in entered.all_rows()
                    if line.source in RESUMING_SOURCES and line.session_agent_id in workers and line.session_agent_id not in running_ids
                    and line.updated_at.text > workers[line.session_agent_id].ended_at.text})

    def has_free_place(self) -> bool:
        return len(self.running()) + self.resuming_count() < self.run_limit()

    def can_resume(self, worker: Agent) -> bool:
        if worker.ended_at is None:
            return True
        with self.scopes.row_scope(worker):
            return self.has_free_place()
