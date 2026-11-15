from engine.enums.agent_role import AgentRole
from engine.time.clock import Clock
from engine.container.container import Container
from engine.driver.hook_event import HookEvent
from engine.driver.hook_route import HookRoute
from engine.query.queries import Queries
from engine.time.timestamp import MINUTE_SECONDS, Timestamp
from core.modules.drivers.support.agent_slices import AgentSlices
from core.modules.drivers.support.contribution_slices import LINES_SLICE
from core.modules.agents.models.agent import Agent
from core.modules.environments.models.environment import Environment
from core.modules.agents.support.agent_rows import AgentRows

MAIN_ACTOR = "agent"


class AgentTicks:
    """Each open agent the lines slice does not answer gets a tick hook through the hook route, so rules that
    keep time speak on their own."""

    def __call__(self, container: Container) -> None:
        queries, route, clock_time = container.get(Queries), container.get(HookRoute), container.get(Clock).timestamp()
        # an agent the lines slice answers hears its time-keeping rules at its minute step instead (doc 1310 section 6.2)
        slices = container.get(AgentSlices)
        agents = [agent for agent in container.get(AgentRows).running() if LINES_SLICE not in slices.tick_slices(agent)]
        environments = {environment.id: environment for environment in queries.query(Environment).find_many([agent.environment_id for agent in agents])}
        for agent in agents:
            route.answer(self.tick(agent, environments[agent.environment_id].name, clock_time))

    @staticmethod
    def tick(agent: Agent, environment: str, clock_time: Timestamp) -> HookEvent:
        seconds = clock_time.value.timestamp()
        actor = MAIN_ACTOR if agent.role == AgentRole.MAIN else f"{agent.role}:{agent.id}"
        return HookEvent.tick(agent.program, agent.session, f"tick-{agent.id}-{int(seconds // MINUTE_SECONDS)}", int(seconds * 1000), actor, environment)
