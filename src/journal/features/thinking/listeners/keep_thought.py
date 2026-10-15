from journal.config import Config
from journal.events.agent.tool_starting import ToolStarting
from journal.features.agent_listener import AgentListener
from journal.features.thinking.thoughts import Thoughts
from journal.providers.providers import Providers


class KeepThought(AgentListener[ToolStarting]):
    """Before each tool use, the agent's latest thought this turn is read from its transcript and kept for the working bubble."""

    def __init__(self, config: Config, providers: Providers, thoughts: Thoughts) -> None:
        self.config, self.providers, self.thoughts = config, providers, thoughts

    def handle(self, event: ToolStarting) -> None:
        thoughts = self.providers.named(event.provider).thoughts_this_turn(self.config.root, event.session)
        if thoughts:
            self.thoughts.keep(event.session, thoughts[-1])
