from dataclasses import dataclass

from journal.events.agent.agent_event import AgentEvent


@dataclass(frozen=True)
class PromptSubmitted(AgentEvent):
    """A prompt reached the agent: the user's words, a line the journal typed, or a notice the agent's tool sent in."""

    prompt: str

    @property
    def by_user(self) -> bool:
        """Typed by the user: neither a [journal] line nor a notice such as a subagent's <task-notification>."""
        return not self.prompt.lstrip().startswith(("[journal]", "[plugin ", "<"))
