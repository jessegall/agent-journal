from dataclasses import dataclass

from core.base.command.command import Command
from core.base.driver.block_condition import BlockCondition
from core.base.driver.nudge import Nudge
from core.modules.drivers.models.agent_block import AgentBlock


@dataclass(frozen=True)
class BlockUntil(Command[AgentBlock]):
    """Blocks an agent until the condition is true; its refused tools are told the nudge."""

    agent_id: int
    nudge: Nudge
    condition: BlockCondition
