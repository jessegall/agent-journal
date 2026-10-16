from journal.engine.machine import Machine
from journal.features.registry import Registry
from journal.events.agent.tool_starting import ToolStarting
from journal.features.agent_listener import AgentListener
from journal.hooks.decision import Decision
from journal.providers.providers import Providers


class HoldWritesUntilOriented(AgentListener[ToolStarting]):
    """A write before the look at what is in flight waits until journal environment here has been run."""

    blocking = True

    def __init__(self, machine: Machine, registry: Registry, providers: Providers) -> None:
        self.machine, self.registry, self.providers = machine, registry, providers

    def handle(self, event: ToolStarting) -> Decision | None:
        from journal.features.briefing.feature import Briefing
        if event.subagent or not self.providers.named(event.provider or "claude").writes(event.tool, event.input):
            return None
        agent = self.machine.agent(event.session, event.environment_id)
        if agent.oriented:
            return None
        said = Briefing.ORIENT.about()
        return None if self.registry.silenced(said) else Decision.refuse(said.rendered())
