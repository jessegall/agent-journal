from journal.events.agent.agent_event import AgentEvent
from journal.events.agent_listener import AgentListener
from journal.support.actor import Actor
from journal.repositories.agents import Agents


class TakeTheMark(AgentListener[AgentEvent]):
    """When the context crosses a mark the agent has not taken yet, the mark is taken and owed on its row; the memory conduct tells the agent to decide."""

    blocking = True

    def __init__(self, agents: Agents) -> None:
        self.agents = agents

    def handle(self, event: AgentEvent) -> None:
        from journal.features.memory.feature import Memory
        if event.context is None or not event.session:
            return
        agent = self.agents.for_session(event.session)
        mark = Memory.mark_due(event.context, agent.context_mark)
        if mark:
            self.agents.touch(agent, Actor.system(), context_mark=mark, mark_owed=mark)
