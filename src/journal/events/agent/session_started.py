from dataclasses import dataclass
from typing import ClassVar

from journal.events.agent.agent_event import AgentEvent


@dataclass(frozen=True)
class SessionStarted(AgentEvent):
    """The agent started or resumed a conversation: the moment for a briefing; a line typed at it lands after the start block."""

    is_turn_end = True

    typing_delay: ClassVar[float] = 4.0

    source: str = ""

