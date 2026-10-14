from dataclasses import dataclass

from journal.events.event import Event


@dataclass(frozen=True)
class AgentEvent(Event):
    """Something the agent did, as its hook reported it. One subclass per hook kind; features listen to these, never to raw hooks."""

    session: str
    environment_id: int
    context: float | None = None
    """How full the agent's context window is, 0 to 1, when its provider reports it."""
