from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class RetireAgent(Command[Agent]):
    """Retires an agent for good, with the reason."""

    agent_id: int
    reason: str
