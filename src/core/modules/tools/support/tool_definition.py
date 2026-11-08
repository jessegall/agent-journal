from dataclasses import dataclass


@dataclass(frozen=True)
class ToolDefinition:
    """A tool the journal supports: the name its commands take, its title and what it does for the project."""

    name: str
    title: str
    description: str
