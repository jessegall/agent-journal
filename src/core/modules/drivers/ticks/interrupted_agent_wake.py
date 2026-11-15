from engine.time.clock import Clock
from engine.container.container import Container
from engine.scope.scopes import Scopes
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.support.agent_slices import AgentSlices
from core.modules.drivers.support.contribution_slices import SAFETY_SLICE
from core.modules.drivers.commands.wake_interrupted_agent.support.interrupted_agents import InterruptedAgents


class InterruptedAgentWake:
    """Every few seconds, looks at each open main agent whose turn was interrupted and wakes the ones nobody
    typed to, until the new driver's safety slice answers that agent."""

    def __call__(self, container: Container) -> None:
        interrupted, timestamp, slices, scopes = container.get(InterruptedAgents), container.get(Clock).timestamp(), container.get(AgentSlices), container.get(Scopes)
        for agent in container.get(AgentRows).running_main_agents():
            with scopes.read_scope((), None, agent.environment_id):
                is_answered = SAFETY_SLICE in slices.tick_slices(agent)
            # the new driver gives an interrupted turn no automatic go-on (doc 1310 section 16, difference 3)
            if not is_answered:
                interrupted.watch(agent, timestamp)
