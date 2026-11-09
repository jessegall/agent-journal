from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.agents.models.agent import Agent


@dataclass(frozen=True)
class RecordAgentInterrupt(Command[Agent]):
    """Records that an agent's turn was interrupted, or, with no moment, that the interrupt is dealt with."""

    agent_id: int
    interrupted: bool = True
