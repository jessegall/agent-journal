from dataclasses import dataclass

from engine.command.command import Command
from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class PauseAgent(Command[Agent]):
    """Holds a running agent: it finishes its step, and only journal lines run until a user resumes it."""

    agent_id: int
