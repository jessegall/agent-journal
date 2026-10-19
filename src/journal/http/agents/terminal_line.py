from typing import TypedDict


class TerminalLine(TypedDict):
    """One part of a shell command the agent ran, as the terminal pane shows it."""

    agent_id: int
    at: float
    tool: str
    command: str
    output: str
    seconds: float
    status: int
    stepped: bool
    level: str
