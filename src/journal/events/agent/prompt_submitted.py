from dataclasses import dataclass

from journal.events.agent.agent_event import AgentEvent


@dataclass(frozen=True)
class PromptSubmitted(AgentEvent):
    """A prompt reached the agent: the user's words, a line the journal typed, or a notice the agent's tool sent in."""

    is_work = True

    prompt: str

    @property
    def is_users(self) -> bool:
        return not self.prompt.lstrip().startswith(("[journal]", "[plugin ", "<", "[Cross-session "))
