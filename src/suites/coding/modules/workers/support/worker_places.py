from core.base.database.kept_rows import KeptRows
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.agents.models.agent import AGENTS_TABLE, Agent
from core.modules.agents.support.agent_type_limits import NO_LIMIT, AgentTypeLimits
from suites.coding.support.coding_agent_role import CodingAgentRole


class WorkerPlaces:
    """How many workers run against the run limit. A run place is a process that has not ended: delivered work with
    its process stopped takes no run place."""

    def __init__(self, queries: Queries, limits: AgentTypeLimits, kept: KeptRows) -> None:
        self.queries, self.limits, self.kept = queries, limits, kept

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

    def has_free_place(self) -> bool:
        return len(self.running()) < self.run_limit()
