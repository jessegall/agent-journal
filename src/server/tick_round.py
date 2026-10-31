from datetime import datetime, timedelta, timezone

from core.base.actor import Actor
from core.base.command.bus import Bus
from core.base.database.database import Database
from core.base.driver.hook_event import HookEvent
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_route import HookRoute
from core.base.error_log import ErrorLog
from core.base.journal_container import synced_container
from core.base.journal_home import JournalHome
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.timestamp import Timestamp
from core.modules.agents.agent import Agent
from core.modules.drivers.hook_call_prune import HookCallPrune
from core.modules.environments.environment import Environment

PRUNE_PERIOD = timedelta(days=1)


class TickRound:
    """One minute of the server's ticker: each open agent gets a tick hook through the hook route, so rules that
    keep time speak on their own, and once a day the old hook calls are pruned."""

    def __init__(self, home: JournalHome) -> None:
        self.home = home
        self.pruned_at = datetime.min.replace(tzinfo=timezone.utc)

    def run(self) -> None:
        container = synced_container(self.home)
        try:
            now = datetime.now(timezone.utc)
            queries, route = container.get(Queries), container.get(HookRoute)
            for agent in tuple(queries.query(Agent).matching(IsNull("ended_at")).all_rows()):
                environment = queries.query(Environment).find(agent.environment_id)
                route.answer(self.tick(agent, environment.name, now))
            if now - self.pruned_at >= PRUNE_PERIOD:
                container.get(Bus).run(HookCallPrune(), Actor.core())
                self.pruned_at = now
        finally:
            container.get(Database).close()

    @staticmethod
    def tick(agent: Agent, environment: str, now: datetime) -> HookEvent:
        minute = int(now.timestamp() // 60)
        return HookEvent(1, agent.program, HookEventName.TICK, agent.session, f"tick-{agent.id}-{minute}", int(now.timestamp() * 1000), "agent",
                         environment, "", None, None, {})

    def report(self, error: Exception) -> None:
        ErrorLog(self.home).reported(["ticker"], error)
