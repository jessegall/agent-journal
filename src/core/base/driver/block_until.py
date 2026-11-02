from dataclasses import dataclass

from core.base.command.command import Command
from core.base.driver.block_condition import BlockCondition
from core.base.driver.nudge import Nudge


@dataclass(frozen=True)
class BlockUntil(Command[object]):
    """Blocks an agent until the condition is true; each tool it may not use is refused with the nudge."""

    agent_id: int
    nudge: Nudge
    condition: BlockCondition
