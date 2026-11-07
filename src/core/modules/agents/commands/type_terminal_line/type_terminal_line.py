from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class TypeTerminalLine(Command[Agent]):
    """Types a line and its Enter into the terminal of a running agent, as the person at the viewer."""

    lock = False

    agent_id: int
    line: str
