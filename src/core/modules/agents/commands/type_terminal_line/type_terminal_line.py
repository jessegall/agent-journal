from dataclasses import dataclass

from engine.command.command import Command
from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class TypeTerminalLine(Command[Agent]):
    """Types a line and its Enter into the terminal of a running agent, as the user at the viewer."""

    lock = False

    agent_id: int
    line: str
