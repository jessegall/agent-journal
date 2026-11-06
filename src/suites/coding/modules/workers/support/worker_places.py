from core.modules.helpers.support.agent_use import AgentUse
from datetime import timedelta

from core.base.clock import Clock
from core.base.database.kept_rows import KeptRows
from core.base.query.conditions.greater import Greater
from core.base.timestamp import Timestamp
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.scope.actor_scope import ActorScope
from core.base.scope.scopes import Scopes
from core.modules.agents.models.agent import AGENTS_TABLE, Agent
from core.modules.usage.support.agent_type_limits import UNLIMITED_AGENT_COUNT, AgentTypeLimits
from core.modules.agents.support.type_limits import TypeLimits
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from suites.coding.modules.workers.support.worker_job import RESUMING_SOURCES
from suites.coding.support.coding_agent_role import CodingAgentRole
from core.modules.agents.support.agent_rows import AgentRows

AGENT_LINES_TABLE = "agent_lines"
JOB_DELIVERY_SECONDS = 120
KEPT_NAMES_SHOWN = 5


class WorkerPlaces:
    """How many workers run against the run limit. A run place is a process that has not ended; a new
    worker and a resume also count a resume handed over in the last two minutes that has not bound yet.
    Delivered work with its process stopped takes no run place."""

    def __init__(self, agents: AgentRows, queries: Queries, limits: AgentTypeLimits, kept: KeptRows, clock: Clock, scopes: Scopes, use: AgentUse) -> None:
        self.use = use
        self.agents, self.queries, self.limits, self.kept, self.clock, self.scopes = agents, queries, limits, kept, clock, scopes

    def running(self) -> tuple[Agent, ...]:
        return self.agents.running(CodingAgentRole.WORKER)

    def kept_workers(self) -> tuple[Agent, ...]:
        return self.kept.scoped_read(AGENTS_TABLE, self.kept_rows, "role = ?", [CodingAgentRole.WORKER.value], name="workers.kept")

    def kept_rows(self) -> tuple[Agent, ...]:
        return tuple(self.queries.query(Agent).filter(role=CodingAgentRole.WORKER).matching(IsNull("retired_at")).newest().all_rows())

    def kept_limit(self) -> int:
        return self.limits.lookup(CodingAgentRole.WORKER).kept

    def can_start_new(self) -> bool:
        workers = self.kept_workers()
        all_kept_run = self.kept_limit() != UNLIMITED_AGENT_COUNT and len(workers) >= self.kept_limit() and all(worker.ended_at is None for worker in workers)
        return not all_kept_run and len(self.running()) < self.run_limit()

    def check_new_place(self) -> None:
        if len(self.running()) + self.resuming_count() >= self.run_limit():
            raise Refusal(f"{self.run_limit()} workers are running", "wait for one to report, or stop one")
        workers = self.kept_workers()
        if self.kept_limit() != UNLIMITED_AGENT_COUNT and len(workers) >= self.kept_limit():
            names = ", ".join(f"agent:{worker.id}" for worker in workers[:KEPT_NAMES_SHOWN])
            raise Refusal(f"the limit of {self.kept_limit()} workers is reached: {names}", self.use.retire_suggestion(CodingAgentRole.WORKER) or TypeLimits.retirement_instruction(workers))

    def run_limit(self) -> int:
        return self.limits.lookup(CodingAgentRole.WORKER).run

    def resuming_lines(self) -> tuple[AgentLine, ...]:
        cutoff_time = self.clock.timestamp().value - timedelta(seconds=JOB_DELIVERY_SECONDS)
        cutoff_at = Timestamp(cutoff_time.replace(second=0, microsecond=0)).text
        with self.scopes.opened(self.scopes.actor_id, self.scopes.environment_id, [ActorScope]):
            return self.kept.read(AGENT_LINES_TABLE, lambda: self.entered_lines(cutoff_at), "state = ? AND updated_at > ?", [AgentLineState.ENTERED, cutoff_at], name=f"workers.resuming_lines.{self.scopes.environment_id}")

    def entered_lines(self, cutoff_at: str) -> tuple[AgentLine, ...]:
        return tuple(self.queries.query(AgentLine).filter(state=AgentLineState.ENTERED).matching(Greater("updated_at", cutoff_at)).all_rows())

    def resuming_count(self) -> int:
        workers = {worker.id: worker for worker in self.kept_workers() if worker.ended_at is not None}
        return len({line.session_agent_id for line in self.resuming_lines() if line.source in RESUMING_SOURCES and line.session_agent_id in workers
                    and line.updated_at.text > workers[line.session_agent_id].ended_at.text})

    def can_resume(self, worker: Agent) -> bool:
        if worker.ended_at is None:
            return True
        with self.scopes.row_scope(worker):
            return len(self.running()) + self.resuming_count() < self.run_limit()
