from dataclasses import dataclass

from journal.events.agent.agent_event import AgentEvent


@dataclass(frozen=True)
class SessionStarted(AgentEvent):
    """The agent started or resumed a conversation: the moment for a briefing."""

    source: str = ""
    """startup, resume, compact or clear, as Claude reports it."""

