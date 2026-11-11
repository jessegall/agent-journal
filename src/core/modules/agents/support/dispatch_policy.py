from contextlib import AbstractContextManager

from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_launch_guard import AgentLaunchGuard
from core.modules.agents.support.agent_stops import AgentStops


class DispatchPolicy:
    """What a suite decides about its agents and the dispatcher acts on: the lock a start of a session takes,
    whether an agent should run now, whether an agent that ended is gone for good, and whether it still takes
    messages. A suite binds its own and never starts or ends a program. The default wants no agent started and
    answers the rest as the launch guard and the stops a suite binds today, until those two are gone."""

    def __init__(self, guard: AgentLaunchGuard, stops: AgentStops) -> None:
        self.guard, self.stops = guard, stops

    def lock(self, session: str) -> AbstractContextManager[bool]:
        return self.guard.lock(session)

    def is_wanted(self, agent: Agent) -> bool:
        return False

    def is_final(self, agent: Agent) -> bool:
        return self.stops.is_final(agent)

    def takes_messages(self, agent: Agent) -> bool:
        return self.stops.takes_messages(agent)
