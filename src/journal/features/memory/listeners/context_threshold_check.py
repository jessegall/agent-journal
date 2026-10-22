from journal.events.agent.agent_event import AgentEvent
from journal.events.agent_listener import AgentListener
from journal.support.actor import Actor
from journal.repositories.agents import Agents


class ContextThresholdCheck(AgentListener[AgentEvent]):
    """When the context crosses a mark the agent has not taken yet, the mark is taken and owed on its row; the memory conduct tells the agent to decide."""

    blocking = True

    def __init__(self, agents: Agents) -> None:
        self.agents = agents

    def handle(self, event: AgentEvent) -> None:
        from journal.features.memory.feature import Memory
        if event.context is None or not event.session:
            return
        agent = self.agents.session_agent(event.session)
        threshold = Memory.threshold_due(event.context, agent.context_threshold)
        if threshold:
            self.agents.touch(agent, Actor.system(), context_threshold=threshold, threshold_due=threshold)
