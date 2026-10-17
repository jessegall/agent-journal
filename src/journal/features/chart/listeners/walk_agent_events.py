from journal.events.agent.agent_event import AgentEvent
from journal.events.agent.ticked import Ticked
from journal.features.agent_listener import AgentListener
from journal.features.chart.context import Context
from journal.engine.machine import Machine
from journal.features.chart.walk import ALL, BEFORE, Walk
from journal.hooks.decision import Decision


class WalkAgentEvents(AgentListener[AgentEvent]):
    """Every agent event walks the workflows that can change the answer before the hook is answered, so a hold or a blocked stop reaches the agent and a line said rides on the answer; a tick, answered by no hook, walks them all."""

    blocking = True

    def __init__(self, walk: Walk, machine: Machine) -> None:
        self.walk, self.machine = walk, machine

    def handle(self, event: AgentEvent) -> Decision | None:
        agent = self.machine.agent(event.session, event.environment_id, event.provider)
        state = self.machine.states.named(agent.state, agent.data)
        decision = self.walk.on(Context(event=event, session=event.session, environment_id=event.environment_id, provider=event.provider or "claude", answers_hook=not isinstance(event, Ticked), state=state), ALL if isinstance(event, Ticked) else BEFORE)
        return decision if not decision.allowed or decision.context else None
