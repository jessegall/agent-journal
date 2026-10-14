from dataclasses import dataclass

from journal.events.agent.agent_event import AgentEvent


@dataclass(frozen=True)
class ToolFinished(AgentEvent):
    """A tool ran and returned."""

    tool: str
    input: dict
    output: str
