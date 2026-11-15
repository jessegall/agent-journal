from engine.enums.agent_role import AgentRole
from engine.driver.hook_event import HookEvent
from engine.query.queries import Queries
from engine.time.clock import Clock
from engine.time.timestamp import MINUTE_SECONDS
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.environments.models.environment import Environment

MAIN_ACTOR = "agent"


class MinuteTick:
    """The tick hook an agent is sent this minute: what a contribution that hears ticks reads at the agent's
    minute step."""

    def __init__(self, agents: AgentRows, queries: Queries, clock: Clock) -> None:
        self.agents, self.queries, self.clock = agents, queries, clock

    def event(self, agent_id: int) -> HookEvent:
        agent = self.agents.find(agent_id)
        environment = self.queries.query(Environment).find(agent.environment_id)
        seconds = self.clock.timestamp().value.timestamp()
        actor = MAIN_ACTOR if agent.role == AgentRole.MAIN else f"{agent.role}:{agent.id}"
        return HookEvent.tick(agent.program, agent.session, f"tick-{agent.id}-{int(seconds // MINUTE_SECONDS)}", int(seconds * 1000), actor, environment.name)
