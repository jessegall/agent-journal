from datetime import timedelta

from core.base.actor import Actor
from core.base.clock import Clock
from core.base.command.bus import Bus
from core.base.container import Container
from core.base.driver.hook_event import HookEvent
from core.base.driver.hook_route import HookRoute
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.base.agent_role import AgentRole
from core.modules.drivers.commands.prune_hook_calls import PruneHookCalls
from core.modules.environments.models.environment import Environment
from core.modules.phone.commands.send_phone_notices import SendPhoneNotices
from server.round_work import RoundWork

PRUNE_PERIOD = timedelta(days=1)
MINUTE_SECONDS = 60
MAIN_ACTOR = "agent"


class TickWork(RoundWork):
    """The ticker's round, once a minute: each open agent other than a subagent gets a tick hook through the hook
    route, so rules that keep time speak on their own; once a day the old hook calls are pruned; and the
    notices that wait on paired phones are pushed."""

    def __init__(self) -> None:
        self.pruned_at: Timestamp | None = None

    def run(self, container: Container) -> None:
        clock_time, queries, route = container.get(Clock).timestamp(), container.get(Queries), container.get(HookRoute)
        for agent in tuple(queries.query(Agent).matching(IsNull("ended_at")).all_rows()):
            if agent.role != AgentRole.SUBAGENT:
                route.answer(self.tick(agent, queries.query(Environment).find(agent.environment_id).name, clock_time))
        if self.pruned_at is None or self.pruned_at.elapsed_seconds(clock_time) >= PRUNE_PERIOD.total_seconds():
            container.get(Bus).run(PruneHookCalls(), Actor.core())
            self.pruned_at = clock_time
        container.get(Bus).run(SendPhoneNotices(), Actor.core())

    @staticmethod
    def tick(agent: Agent, environment: str, clock_time: Timestamp) -> HookEvent:
        seconds = clock_time.value.timestamp()
        actor = MAIN_ACTOR if agent.role == AgentRole.MAIN else f"{agent.role}:{agent.id}"
        return HookEvent.tick(agent.program, agent.session, f"tick-{agent.id}-{int(seconds // MINUTE_SECONDS)}", int(seconds * 1000), actor, environment)
