from dataclasses import dataclass, field

from journal.events.agent.agent_event import AgentEvent


@dataclass(frozen=True)
class ToolFinished(AgentEvent):
    """A tool ran and returned."""

    tool: str
    input: dict
    output: str
    response: dict = field(default_factory=dict)
    """The tool's answer as it came, when it came as a structure: a shell's output in parts, an edit's patch."""
    read_paths: tuple[str, ...] = ()
    """The files this call read, by the read tool or a shell line that prints them."""
    skill_loaded: str = ""
    """The skill folder this call loaded, when it was the skill tool."""
