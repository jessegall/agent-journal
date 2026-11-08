from core.base.clock import Clock
from core.base.container import Container
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.commands.wake_interrupted_agent.support.interrupted_agents import InterruptedAgents


class InterruptedAgentWake:
    """Every few seconds, looks at each open main agent whose turn was interrupted and wakes the ones nobody
    typed to."""

    def __call__(self, container: Container) -> None:
        interrupted, timestamp = container.get(InterruptedAgents), container.get(Clock).timestamp()
        for agent in container.get(AgentRows).running_main_agents():
            interrupted.watch(agent, timestamp)
