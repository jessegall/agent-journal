from engine.driver.hook_event import HookEvent
from engine.query.queries import Queries
from engine.time.clock import Clock
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.ticks.agent_ticks import AgentTicks
from core.modules.environments.models.environment import Environment


class MinuteTick:
    """The tick hook an agent would have been sent now: what a contribution that hears ticks reads at the
    agent's minute step, which replaces that hook."""

    def __init__(self, agents: AgentRows, queries: Queries, clock: Clock) -> None:
        self.agents, self.queries, self.clock = agents, queries, clock

    def event(self, agent_id: int) -> HookEvent:
        agent = self.agents.find(agent_id)
        environment = self.queries.query(Environment).find(agent.environment_id)
        return AgentTicks.tick(agent, environment.name, self.clock.timestamp())
