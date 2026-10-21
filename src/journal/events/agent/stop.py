from dataclasses import dataclass

from journal.events.agent.agent_event import AgentEvent


@dataclass(frozen=True)
class Stop(AgentEvent):
    """The agent finished its turn and waits for the user: the moment to tell it about work in hand."""

    held_before: bool = False


