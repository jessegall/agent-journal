from journal.engine.machine import Machine
from journal.features.registry import Registry
from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent_listener import AgentListener
from journal.support.requiring import Requiring
from journal.support.decision import Decision
from journal.providers.providers import Providers


class HoldWritesWhileSkillOwed(AgentListener[ToolStarting]):
    """A write while a skill is owed waits until its file is read; a read goes through, since that is how the debt is paid."""

    blocking = True

    def __init__(self, machine: Machine, requiring: Requiring, providers: Providers, registry: Registry) -> None:
        self.machine, self.requiring, self.providers, self.registry = machine, requiring, providers, registry

    def handle(self, event: ToolStarting) -> Decision | None:
        if event.subagent or not self.providers.named(event.provider or "claude").writes(event.tool, event.input):
            return None
        agent = self.machine.agent(event.session, event.environment_id)
        owed = [skill for name in self.requiring.owed_names(agent) for skill in self.requiring.named(name)]
        if not owed:
            return None
        from journal.features.skills.feature import Skills
        said = [Skills.REQUIRED.create(skill=skill.name, path=self.requiring.path_of(skill)) for skill in owed]
        return None if self.registry.silenced(said[0]) else Decision.refuse("\n".join(s.rendered() for s in said))
