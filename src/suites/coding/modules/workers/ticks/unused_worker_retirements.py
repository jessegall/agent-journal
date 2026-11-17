from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.container.container import Container
from engine.errors.refusal import Refusal
from engine.query.conditions.is_null import IsNull
from engine.query.conditions.less import Less
from engine.query.queries import Queries
from engine.scope.environment_scope import EnvironmentScope
from engine.scope.scopes import Scopes
from engine.time.clock import Clock
from engine.time.timestamp import HOUR_SECONDS
from core.modules.agents.commands.retire_agent.retire_agent import RetireAgent
from core.modules.agents.models.agent import Agent
from core.modules.helpers.support.unused_helpers import UnusedHelpers
from core.modules.helpers.ticks.unused_helper_retirements import UNUSED_REASON
from suites.coding.modules.workers.types.worker import Worker

RETIREMENTS_PER_TICK = 20
UNUSED_WORKERS_REASON = "the stopped workers past the idle hours, oldest first, a few retired each tick"


class UnusedWorkerRetirements:
    """Retires the workers that stopped longer ago than the idle hours of the helpers, as read-only helpers are, a few
    each tick so a backlog never holds the server; a worker its retirement refuses, for unmerged or uncommitted work,
    is left alone for the rest of the server's run."""

    def __init__(self) -> None:
        self.refused_ids: set[int] = set()

    def __call__(self, container: Container) -> None:
        hours = container.get(UnusedHelpers).idle_hours()
        if not hours:
            return
        cutoff = container.get(Clock).timestamp().plus_seconds(-hours * HOUR_SECONDS)
        with container.get(Scopes).opened(None, disabled=[EnvironmentScope]):
            stopped = container.get(Queries).query(Agent).filter(role=Worker.key).matching(IsNull("retired_at")).matching(Less("ended_at", cutoff.text)).oldest()
            workers = [worker for worker in stopped.every_row(UNUSED_WORKERS_REASON) if worker.id not in self.refused_ids][:RETIREMENTS_PER_TICK]
        for worker in workers:
            try:
                container.get(Bus).run(RetireAgent(worker.id, UNUSED_REASON.format(hours=hours)), Actor.core(), environment_id=worker.environment_id)
            except Refusal:
                self.refused_ids.add(worker.id)
