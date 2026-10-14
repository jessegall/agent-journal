from dataclasses import dataclass

from journal.events.agent.agent_event import AgentEvent


@dataclass(frozen=True)
class Ticked(AgentEvent):
    """The clock, every few seconds, for each live agent: the moment for anything that happens on time rather than on a hook."""

    at: float
    quiet_for: float
