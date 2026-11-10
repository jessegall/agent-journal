from dataclasses import dataclass

from engine.command.command import Command
from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class LaunchAgent(Command[Agent]):
    """Starts an agent program in the caller's environment, through the running launcher."""

    program: str
