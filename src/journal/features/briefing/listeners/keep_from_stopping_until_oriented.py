from journal.engine.state_machine import StateMachine
from journal.features.registry import Registry
from journal.events.agent.idle import Idle
from journal.events.agent_listener import AgentListener
from journal.support.decision import Decision


class KeepFromStoppingUntilOriented(AgentListener[Idle]):
    """A stop before the look at what is in flight is held until journal environment here has been run."""

    blocking = True

    def __init__(self, machine: StateMachine, registry: Registry) -> None:
        self.machine, self.registry = machine, registry

    def handle(self, event: Idle) -> Decision | None:
        from journal.features.briefing.feature import Briefing
        agent = self.machine.agent(event.session, event.environment_id)
        if agent.oriented:
            return None
        said = Briefing.STOPPED_UNORIENTED.create()
        return None if self.registry.silenced(said) else Decision.refuse(said.rendered())
