from journal.engine.machine import Machine
from journal.features.registry import Registry
from journal.events.agent.idle import Idle
from journal.events.agent_listener import AgentListener
from journal.support.decision import Decision


class KeepFromStoppingWhileMarkOwed(AgentListener[Idle]):
    """A stop at a context mark not decided at is held until a fact, a rule or journal nothing pays it."""

    blocking = True

    def __init__(self, machine: Machine, registry: Registry) -> None:
        self.machine, self.registry = machine, registry

    def handle(self, event: Idle) -> Decision | None:
        from journal.features.memory.feature import Memory
        agent = self.machine.agent(event.session, event.environment_id)
        if not agent.mark_owed:
            return None
        said = Memory.STOPPED_AT_MARK.create(percent=agent.mark_owed)
        return None if self.registry.silenced(said) else Decision.refuse(said.rendered())
