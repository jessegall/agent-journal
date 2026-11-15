from collections.abc import Sequence

from engine.agent_machine.contracts.event_line_source import EventLineSource
from engine.driver.hook_event import HookEvent
from engine.driver.nudge import Nudge
from engine.enums.hook_event_name import HookEventName
from engine.enums.nudge_type import NudgeType
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.drivers.support.open_block_rows import OpenBlockRows

BLOCK_COUNTDOWN_KEY = "drivers.block-countdown"


class BlockCountdownLines(EventLineSource):
    """Before each tool use of a hold's grace, the agent is told how many tool uses are left before the hold refuses,
    in the hold's own countdown line, from the last few uses on."""

    key = BLOCK_COUNTDOWN_KEY
    events = [HookEventName.PRE_TOOL_USE]

    def __init__(self, open_blocks: OpenBlockRows) -> None:
        self.open_blocks = open_blocks

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        counted = [block for block in self.open_blocks.rows(agent_id) if block.countdown_text and block.grace_tool_uses]
        if not counted:
            return []
        uses = self.open_blocks.grace_uses(agent_id)
        return [nudge for block in counted if (nudge := self.countdown(block, uses.get(block.id, 0))) is not None]

    @staticmethod
    def countdown(block: AgentBlock, tool_uses: int) -> Nudge | None:
        remaining = block.grace_tool_uses - tool_uses - 1
        if not 0 <= remaining < block.countdown_limit:
            return None
        return Nudge(block.countdown_key, NudgeType.STEERING, block.countdown_text.replace("{left}", str(remaining)), turn_limited=False)
