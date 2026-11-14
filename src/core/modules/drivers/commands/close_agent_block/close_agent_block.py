from dataclasses import dataclass

from engine.command.command import Command
from core.modules.drivers.models.agent_block import AgentBlock


@dataclass(frozen=True)
class CloseAgentBlock(Command[AgentBlock]):
    """Ends a block whose condition has become true, or skips a block that has a grace, with the reason."""

    agent_block_id: int
    skip_reason: str = ""
