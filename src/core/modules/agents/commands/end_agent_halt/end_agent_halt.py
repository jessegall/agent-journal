from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class EndAgentHalt(Command[Agent]):
    """Clears the record that the agent was stopped at its program's usage limit."""

    agent_id: int
