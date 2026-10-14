from dataclasses import dataclass

from journal.events.agent.agent_event import AgentEvent


@dataclass(frozen=True)
class TurnWritten(AgentEvent):
    """The agent wrote a turn for the user: what reaches the chat, and what the message tags are read from."""

    text: str
    turn_id: str = ""
    final: bool = True
    """Claude streams a turn in deltas; the last one is final."""
