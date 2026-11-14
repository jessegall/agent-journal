from dataclasses import dataclass

from engine.command.command import Command
from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class ChangeAgentDriver(Command[Agent]):
    """Moves a stopped agent to another program or model, under the same journal agent."""

    agent_id: int
    program: str
    program_model: str
