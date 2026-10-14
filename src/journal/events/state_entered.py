from dataclasses import dataclass

from journal.events.event import Event


@dataclass(frozen=True, kw_only=True)
class StateEntered(Event):
    """The machine moved an agent into a different state, by an event or a command. Not an AgentEvent: no hook reported it."""

    session: str
    environment_id: int
    left: str
    entered: str
