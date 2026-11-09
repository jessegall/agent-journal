from core.base.container import Container
from core.base.driver.agent_hook import AgentHook
from core.base.driver.block_check import BlockCheck
from core.base.module.block_conditions import BlockConditions
from dataclasses import dataclass

from core.base.driver.count_down import COUNTDOWN_LINE_BELOW
from core.base.driver.interval import Interval
from core.base.driver.seconds import Seconds
from core.base.model.model import Model
from core.base.timestamp import Timestamp
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan


@dataclass(frozen=True, kw_only=True)
class AgentBlock(Model):
    """An agent held from all but reading and journal commands: the line its refused tools are told, what ends
    the block and when it ended. A block with a grace holds only after that many tool uses or seconds, says
    its countdown line meanwhile, and may be skipped with a reason; so may a block declared skippable. A block
    that holds the stop only leaves the agent's tools alone."""

    model_name = "agent_block"
    cli_name = "agent-block"

    session_agent_id: int
    creator_id: int
    nudge_key: str
    nudge_text: str
    condition_name: str
    condition_text: str
    closed_at: Timestamp | None = None
    grace_tool_uses: int = 0
    grace_seconds: int = 0
    countdown_key: str = ""
    countdown_text: str = ""
    skip_reason: str = ""
    blocks_stop: bool = False
    strict: bool = False
    is_skippable: bool = False
    countdown_from: int = COUNTDOWN_LINE_BELOW

    def is_finished(self, conditions: BlockConditions, hook: AgentHook, container: Container) -> bool:
        return conditions.built(self.condition_name, self.condition_text).is_true(BlockCheck(hook, self.creation_timestamp(), container))

    def is_active(self, tool_uses: int, timestamp: Timestamp) -> bool:
        if self.blocks_stop:
            return False
        if not self.grace_tool_uses and not self.grace_seconds:
            return True
        return bool((self.grace_tool_uses and tool_uses >= self.grace_tool_uses)
                    or (self.grace_seconds and self.creation_timestamp().elapsed_seconds(timestamp) >= self.grace_seconds))

    @property
    def grace(self) -> Interval | None:
        spans = [span for span in (ToolUseSpan(self.grace_tool_uses), Seconds(self.grace_seconds)) if span.count]
        return Interval(*spans) if spans else None
