from dataclasses import dataclass

from engine.command.command import Command
from engine.driver.block_condition import BlockCondition
from engine.driver.count_down import COUNTDOWN_TOOL_USES
from engine.driver.interval import Interval
from engine.driver.nudge import Nudge


@dataclass(frozen=True)
class BlockUntil(Command[object]):
    """Blocks an agent until the condition is true; each tool it may not use is refused with the nudge. With
    an interval in after, the block holds only once that grace has passed, and the countdown nudge is shown
    while it runs: {block} in the nudge is the block's number and {left} in the countdown the tool uses
    remaining, shown once fewer than countdown_limit remain. A block that holds the stop refuses only the
    agent's stop, no tool. A strict block lets through nothing but reading a skill, where any other lets
    through reads and journal commands."""

    agent_id: int
    nudge: Nudge
    condition: BlockCondition
    after: Interval | None = None
    countdown: Nudge | None = None
    blocks_stop: bool = False
    strict: bool = False
    is_skippable: bool = False
    countdown_limit: int = COUNTDOWN_TOOL_USES
