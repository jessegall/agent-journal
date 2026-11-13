from engine.agent.work.agent_work import AgentWork
from datetime import timedelta

from engine.time.clock import Clock
from engine.database.kept_rows import KeptRows
from engine.query.conditions.greater import Greater
from engine.time.timestamp import Timestamp
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from engine.errors.refusal import Refusal
from engine.listener.rows.event_rows import EventRows
from engine.scope.actor_scope import ActorScope
from engine.scope.scopes import Scopes
from core.modules.agents.models.agent import Agent
from core.modules.usage.support.agent_type_limits import UNLIMITED_AGENT_COUNT, AgentTypeLimits
from core.modules.agents.support.type_limits import TypeLimits
from core.modules.drivers.models.agent_line import AgentLine
from core.modules.drivers.models.enums.agent_line_state import AgentLineState
from suites.coding.modules.workers.support.worker_job import RESUMING_SOURCES
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from core.modules.agents.support.agent_rows import AgentRows

KEPT_WORKERS_REASON = "the places count every kept worker and every line that resumes one"

JOB_DELIVERY_SECONDS = 120
KEPT_NAMES_SHOWN = 5


class WorkerPlaces:
    """Counts processes, starts in progress and delivered work against the worker limit."""

    def __init__(self, agents: AgentRows, queries: Queries, limits: AgentTypeLimits, kept: KeptRows, clock: Clock, scopes: Scopes, work: AgentWork, rows: EventRows) -> None:
        self.work, self.rows = work, rows
        self.agents, self.queries, self.limits, self.kept, self.clock, self.scopes = agents, queries, limits, kept, clock, scopes

    def running(self) -> tuple[Agent, ...]:
        running = self.agents.running(CodingHelperRole.WORKER)
        pending_ids = tuple(self.work.pending())
        pending = tuple(self.rows.required_index(Agent, pending_ids).values())
        return tuple({worker.id: worker for worker in (*running, *pending)}.values())

    def kept_workers(self) -> tuple[Agent, ...]:
        workers = self.queries.query(Agent).filter(role=CodingHelperRole.WORKER).matching(IsNull("retired_at")).newest()
        return self.kept.read(workers, lambda: tuple(workers.every_row(KEPT_WORKERS_REASON)), name="workers.kept")

    def kept_limit(self) -> int:
        return self.limits.required(CodingHelperRole.WORKER).kept

    def can_start_new(self) -> bool:
        workers = self.kept_workers()
        running = self.running()
        running_ids = {worker.id for worker in running}
        all_kept_run = self.kept_limit() != UNLIMITED_AGENT_COUNT and len(workers) >= self.kept_limit() and all(worker.id in running_ids for worker in workers)
        return not all_kept_run and len(running) < self.run_limit()

    def free_count(self) -> int:
        return max(0, self.run_limit() - len(self.running()))

    def check_new_place(self) -> None:
        if len(self.running()) + self.resuming_count() >= self.run_limit():
            raise Refusal(f"{self.run_limit()} workers are running", "wait for a merge, release or retirement")
        workers = self.kept_workers()
        if self.kept_limit() != UNLIMITED_AGENT_COUNT and len(workers) >= self.kept_limit():
            names = ", ".join(f"agent:{worker.number}" for worker in workers[:KEPT_NAMES_SHOWN])
            raise Refusal(f"the limit of {self.kept_limit()} workers is reached: {names}", TypeLimits.kept_limit_suggestion(workers))

    def run_limit(self) -> int:
        return self.limits.required(CodingHelperRole.WORKER).run

    def resuming_lines(self) -> tuple[AgentLine, ...]:
        cutoff_value_at = self.clock.timestamp().value - timedelta(seconds=JOB_DELIVERY_SECONDS)
        cutoff_at = Timestamp(cutoff_value_at.replace(second=0, microsecond=0)).text
        with self.scopes.opened(self.scopes.actor_id, self.scopes.environment_id, [ActorScope]):
            lines = self.queries.query(AgentLine).filter(state=AgentLineState.ENTERED).matching(Greater("updated_at", cutoff_at))
            return self.kept.read(lines, lambda: tuple(lines.every_row(KEPT_WORKERS_REASON)), name=f"workers.resuming_lines.{self.scopes.environment_id}")

    def resuming_count(self) -> int:
        pending = self.work.pending()
        ended_at = {worker.id: worker.ended_at for worker in self.kept_workers() if worker.ended_at is not None and worker.id not in pending}
        return len({line.session_agent_id for line in self.resuming_lines() if line.source in RESUMING_SOURCES and line.session_agent_id in ended_at
                    and line.update_timestamp().text > ended_at[line.session_agent_id].text})

    def can_resume(self, worker: Agent) -> bool:
        if worker.ended_at is None:
            return True
        with self.scopes.row_scope(worker):
            if self.run_limit() == 0:
                return False
            if worker.id in self.work.pending():
                return True
            return len(self.running()) + self.resuming_count() < self.run_limit()
