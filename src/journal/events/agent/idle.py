from dataclasses import dataclass

from journal.events.agent.agent_event import AgentEvent


@dataclass(frozen=True)
class Idle(AgentEvent):
    """The agent finished its turn and waits for the user: the moment to tell it about work in hand."""

    again: bool = False
    """True when this stop was already refused once; refusing again would loop, so nothing is said."""

