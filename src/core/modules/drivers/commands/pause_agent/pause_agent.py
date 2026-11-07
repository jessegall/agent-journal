from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class PauseAgent(Command[Agent]):
    """Holds a running agent: it finishes its step, and only journal lines run until a person resumes it."""

    agent_id: int
