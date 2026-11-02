from dataclasses import dataclass

from core.base.command.command import Command
from core.modules.drivers.models.agent_block import AgentBlock


@dataclass(frozen=True)
class CloseAgentBlock(Command[AgentBlock]):
    """Ends a block whose condition has become true."""

    agent_block_id: int
