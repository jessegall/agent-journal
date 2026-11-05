from dataclasses import dataclass

from core.base.command.command import Command
from core.base.driver.block_condition import BlockCondition
from core.base.driver.interval import Interval
from core.base.driver.nudge import Nudge


@dataclass(frozen=True)
class BlockUntil(Command[object]):
    """Blocks an agent until the condition is true; each tool it may not use is refused with the nudge. With
    an interval in after, the block holds only once that grace has passed, and the countdown nudge is said
    while it runs: {block} in the nudge is the block's number and {left} in the countdown the tool uses
    left. A block that holds the stop only refuses no tool, only the agent's stop. A strict block lets through
    nothing but reading a skill, where any other lets through reads and journal commands."""

    agent_id: int
    nudge: Nudge
    condition: BlockCondition
    after: Interval | None = None
    countdown: Nudge | None = None
    blocks_stop: bool = False
    strict: bool = False
