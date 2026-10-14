from journal.engine.machine import Machine
from journal.events.agent.session_started import SessionStarted
from journal.features.agent_listener import AgentListener
from journal.features.skills.requiring import Requiring
from journal.hooks.decision import Decision


class RequireAtStart(AgentListener[SessionStarted]):
    """A session starts owing the journal skill and the skill of the state it is in."""

    blocking = True

    def __init__(self, machine: Machine, requiring: Requiring) -> None:
        self.machine, self.requiring = machine, requiring

    def handle(self, event: SessionStarted) -> Decision | None:
        agent = self.machine.agent(event.session, event.environment_id)
        state = self.machine.states.named(agent.state, agent.data)
        skills = [self.requiring.registry.skill_named("journal"), *self.requiring.for_state(state)]
        lines = self.requiring.hold(agent, self.requiring.owed(agent, [s for s in skills if s]))
        return Decision.tell("\n".join(lines)) if lines else None
