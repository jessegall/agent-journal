from journal.engine.machine import Machine
from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.ticked import Ticked
from journal.events.agent_listener import AgentListener
from journal.features.chart.context import Context
from journal.features.chart.walk import AFTER, Walk


class WalkAgentEventsAfter(AgentListener[AgentEvent]):
    """The quiet workflows of an agent event, those that only type, show a card or start a sequence, walked after the hook is answered, so the agent never waits on them."""

    def __init__(self, walk: Walk, machine: Machine) -> None:
        self.walk, self.machine = walk, machine

    def handle(self, event: AgentEvent) -> None:
        if isinstance(event, Ticked):
            return
        agent = self.machine.agent(event.session, event.environment_id, event.provider)
        state = self.machine.states.named(agent.state, agent.data)
        self.walk.on(Context(event=event, session=event.session, environment_id=event.environment_id, provider=event.provider or "claude", answers_hook=False, state=state), AFTER)
