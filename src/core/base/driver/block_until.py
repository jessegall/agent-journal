from dataclasses import dataclass

from core.base.command.command import Command
from core.base.driver.block_condition import BlockCondition
from core.base.driver.count_down import COUNTDOWN_LINE_BELOW
from core.base.driver.interval import Interval
from core.base.driver.nudge import Nudge


@dataclass(frozen=True)
class BlockUntil(Command[object]):
    """Blocks an agent until the condition is true; each tool it may not use is refused with the nudge. With
    an interval in after, the block holds only once that grace has passed, and the countdown nudge is shown while
    it runs: {block} in the nudge is the block's number and {left} in the countdown the tool uses remaining, shown
    once fewer than countdown_from remain. A block that holds the stop refuses only the agent's stop, no
    tool. A strict block lets through nothing but reading a skill, where any other lets through reads and journal
    commands."""

    agent_id: int
    nudge: Nudge
    condition: BlockCondition
    after: Interval | None = None
    countdown: Nudge | None = None
    blocks_stop: bool = False
    strict: bool = False
    is_skippable: bool = False
    countdown_from: int = COUNTDOWN_LINE_BELOW
