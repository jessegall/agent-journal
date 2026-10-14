from dataclasses import dataclass

from journal.events.agent.agent_event import AgentEvent


@dataclass(frozen=True)
class Compacting(AgentEvent):
    """The agent's context is about to be compacted: the last chance to make it write something down."""

