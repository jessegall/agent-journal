from dataclasses import dataclass

from core.base.driver.interval import Interval
from core.base.driver.seconds import Seconds
from core.base.model.model import Model
from core.base.timestamp import Timestamp
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan


@dataclass(frozen=True, kw_only=True)
class AgentBlock(Model):
    """An agent held from all but reading and journal commands: the line its refused tools are told, what ends
    the block and when it ended. A block with a grace holds only after that many tool uses or seconds, says
    its countdown line meanwhile, and may be skipped with a reason."""

    model_name = "agent_block"
    cli_name = "agent-block"

    agent_id: int
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

    @property
    def grace(self) -> Interval | None:
        spans = [span for span in (ToolUseSpan(self.grace_tool_uses), Seconds(self.grace_seconds)) if span.count]
        return Interval(*spans) if spans else None
