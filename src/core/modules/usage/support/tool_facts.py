from dataclasses import dataclass


@dataclass(frozen=True)
class ToolFacts:
    """What the line above the composer says: the tool the main agent runs, or what it waits for while it runs
    none, or, for an agent that has run no command at all, a note that says so."""

    tool: str = ""
    wait_target: str = ""
    note: str = ""
