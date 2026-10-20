from journal.events.agent.agent_event import AgentEvent
from journal.events.agent_listener import AgentListener
from journal.features.chart.support.context import Context
from journal.engine.state_machine import StateMachine
from journal.features.chart.support.walk import ALL, BEFORE, Walk
from journal.support.decision import Decision


class WalkAgentEvents(AgentListener[AgentEvent]):
    """Every agent event walks the workflows that can change the answer before the hook is answered, so a hold or a blocked stop reaches the agent and a line said rides on the answer; an event no hook waits on, as a tick, walks them all."""

    blocking = True

    def __init__(self, walk: Walk, machine: StateMachine) -> None:
        self.walk, self.machine = walk, machine

    def handle(self, event: AgentEvent) -> Decision | None:
        agent = self.machine.agent(event.session, event.environment_id, event.provider)
        state = self.machine.states.named(agent.state, agent.data)
        decision = self.walk.on(Context(event=event, session=event.session, environment_id=event.environment_id, provider=event.provider or agent.provider or "claude", answers_hook=event.answers_hook, state=state), BEFORE if event.answers_hook else ALL)
        return decision if not decision.allowed or decision.context else None
