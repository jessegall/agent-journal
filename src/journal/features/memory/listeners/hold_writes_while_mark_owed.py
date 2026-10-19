from journal.engine.machine import Machine
from journal.features.registry import Registry
from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent_listener import AgentListener
from journal.support.decision import Decision
from journal.providers.providers import Providers


class HoldWritesWhileMarkOwed(AgentListener[ToolStarting]):
    """A write at a context mark not decided at waits until a fact, a rule or journal nothing pays it."""

    blocking = True

    def __init__(self, machine: Machine, registry: Registry, providers: Providers) -> None:
        self.machine, self.registry, self.providers = machine, registry, providers

    def handle(self, event: ToolStarting) -> Decision | None:
        from journal.features.memory.feature import Memory
        if event.subagent or not self.providers.named(event.provider or "claude").writes(event.tool, event.input):
            return None
        agent = self.machine.agent(event.session, event.environment_id)
        if not agent.mark_owed:
            return None
        said = Memory.HELD.about()
        return None if self.registry.silenced(said) else Decision.refuse(said.rendered())
