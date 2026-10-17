from journal.engine.machine import Machine
from journal.engine.states.paused import Paused
from journal.events.agent.idle import Idle
from journal.features.agent_listener import AgentListener
from journal.features.registry import Registry
from journal.features.sequences.running import Running
from journal.hooks.decision import Decision


class SayTheStepAtAStop(AgentListener[Idle]):
    """A stop while a sequence runs is held with the step in hand, unless the agent waits on something."""

    blocking = True

    def __init__(self, machine: Machine, running: Running, registry: Registry) -> None:
        self.machine, self.running, self.registry = machine, running, registry

    def handle(self, event: Idle) -> Decision | None:
        run = self.running.in_hand(event.session, event.environment_id)
        if run is None or isinstance(self.machine.current(event.session), Paused):
            return None
        said = self.running.step(run)
        return None if self.registry.silenced(said) else Decision.refuse(said.rendered())
