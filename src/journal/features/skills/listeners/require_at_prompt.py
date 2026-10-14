import re

from journal.engine.machine import Machine
from journal.events.agent.prompt_submitted import PromptSubmitted
from journal.features.agent_listener import AgentListener
from journal.features.skills.requiring import Requiring
from journal.hooks.decision import Decision


class RequireAtPrompt(AgentListener[PromptSubmitted]):
    """A prompt that names a skill's keyword requires that skill before the agent answers."""

    blocking = True

    def __init__(self, machine: Machine, requiring: Requiring) -> None:
        self.machine, self.requiring = machine, requiring

    def handle(self, event: PromptSubmitted) -> Decision | None:
        words = {w.lower() for w in re.findall(r"[a-z]+", event.prompt, re.I)}
        named = [skill for skill in self.requiring.registry.skills() if words & {k.lower() for k in skill.keywords}]
        agent = self.machine.agent(event.session, event.environment_id)
        lines = self.requiring.hold(agent, self.requiring.owed(agent, named))
        return Decision.tell("\n".join(lines)) if lines else None
