from dataclasses import dataclass

from journal.events.agent.agent_event import AgentEvent


@dataclass(frozen=True)
class PromptSubmitted(AgentEvent):
    """The user sent the agent a prompt."""

    prompt: str
