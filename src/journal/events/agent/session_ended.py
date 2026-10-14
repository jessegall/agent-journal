from dataclasses import dataclass

from journal.events.agent.agent_event import AgentEvent


@dataclass(frozen=True)
class SessionEnded(AgentEvent):
    """The conversation ended."""

