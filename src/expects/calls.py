"""The shell calls an expectation is given: one asked of the gate, and one the gate answered."""

from events.agents import ToolCallAnswered
from events.asking import ToolCallAsked

SHELL = "Bash"


def shell_asked(command: str) -> ToolCallAsked:
    return ToolCallAsked(tool=SHELL, input=command, command=command, session="claude-1")


def shell_answered(command: str, why: str = "") -> ToolCallAnswered:
    return ToolCallAnswered(agent=1, tool=SHELL, input=command, command=command, why=why)
