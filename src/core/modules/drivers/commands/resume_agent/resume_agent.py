from dataclasses import dataclass

from engine.command.command import Command
from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class ResumeAgent(Command[Agent]):
    """Lets a paused agent carry on, and tells it so."""

    agent_id: int
