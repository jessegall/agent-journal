from dataclasses import dataclass

from journal.events.agent.agent_event import AgentEvent


@dataclass(frozen=True)
class ToolStarting(AgentEvent):
    """The agent is about to run a tool; the one moment a blocking listener can refuse."""

    tool: str
    input: dict
    writes: bool = False
    """Whether this tool changes a file, as the agent's provider says."""
