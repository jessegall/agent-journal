from journal.engine.machine import Machine
from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.features.agent_listener import AgentListener
from journal.features.registry import Registry
from journal.features.skills.requiring import Requiring
from journal.hooks.decision import Decision


class RequireAtPrompt(AgentListener[PromptSubmitted]):
    """A prompt that names a skill's keyword requires that skill before the agent answers."""

    blocking = True

    def __init__(self, machine: Machine, requiring: Requiring, registry: Registry) -> None:
        self.machine, self.requiring, self.registry = machine, requiring, registry

    def handle(self, event: PromptSubmitted) -> Decision | None:
        from journal.features.skills.feature import Skills
        if self.registry.silenced(Skills.REQUIRED):
            return None
        agent = self.machine.agent(event.session, event.environment_id)
        lines = self.requiring.require(agent, self.requiring.owed(agent, self.requiring.named_in(event.prompt)))
        return Decision.tell("\n".join(lines)) if lines else None
