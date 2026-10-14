"""What the thinking feature recognises in an agent's transcript and chat."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class TranscriptRead(Fact):
    """How far an agent's transcript has been read, the thought it now shows, and the thoughts it finished since."""

    agent: int
    path: str
    offset: int
    thinking: str
    thoughts: tuple[str, ...] = ()


@dataclass(frozen=True, kw_only=True)
class ThinkingCleared(Fact):
    """A visible message ended what the agent was thinking."""

    agent: int
