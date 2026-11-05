from core.base.agent_role import AgentRole
from core.base.clock import Clock
from core.base.container import Container
from core.base.driver.hook_event import HookEvent
from core.base.driver.hook_route import HookRoute
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.timestamp import MINUTE_SECONDS, Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.environments.models.environment import Environment

MAIN_ACTOR = "agent"


class AgentTicks:
    """Each open agent other than a subagent gets a tick hook through the hook route, so rules that keep time
    speak on their own."""

    def __call__(self, container: Container) -> None:
        queries, route, clock_time = container.get(Queries), container.get(HookRoute), container.get(Clock).timestamp()
        for agent in tuple(queries.query(Agent).matching(IsNull("ended_at")).all_rows()):
            if agent.role != AgentRole.SUBAGENT:
                route.answer(self.tick(agent, queries.query(Environment).find(agent.environment_id).name, clock_time))

    @staticmethod
    def tick(agent: Agent, environment: str, clock_time: Timestamp) -> HookEvent:
        seconds = clock_time.value.timestamp()
        actor = MAIN_ACTOR if agent.role == AgentRole.MAIN else f"{agent.role}:{agent.id}"
        return HookEvent.tick(agent.program, agent.session, f"tick-{agent.id}-{int(seconds // MINUTE_SECONDS)}", int(seconds * 1000), actor, environment)
