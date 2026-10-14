from dataclasses import dataclass

from journal.events.agent.agent_event import AgentEvent


@dataclass(frozen=True)
class ToolFinished(AgentEvent):
    """A tool ran and returned."""

    tool: str
    input: dict
    output: str
    read_path: str = ""
    """The file this call read, when it was a read."""
    skill_loaded: str = ""
    """The skill folder this call loaded, when it was the skill tool."""
