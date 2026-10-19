from journal.engine.machine import Machine
from journal.events.agent.session_started import SessionStarted
from journal.events.agent_listener import AgentListener
from journal.features.registry import Registry
from journal.features.skills.requiring import Requiring
from journal.support.decision import Decision


class RequireAtStart(AgentListener[SessionStarted]):
    """A session starts owing the journal skill and the skill of the state it is in: the engine's own, never a node."""

    blocking = True

    def __init__(self, machine: Machine, requiring: Requiring, registry: Registry) -> None:
        self.machine, self.requiring, self.registry = machine, requiring, registry

    def handle(self, event: SessionStarted) -> Decision | None:
        from journal.features.skills.feature import Skills
        if self.registry.silenced(Skills.REQUIRED):
            return None
        agent = self.machine.agent(event.session, event.environment_id)
        state = self.machine.states.named(agent.state, agent.data)
        skills = [*self.requiring.named("journal"), *self.requiring.for_state(state)]
        lines = self.requiring.require(agent, self.requiring.owed(agent, skills))
        return Decision.tell("\n".join(lines)) if lines else None
