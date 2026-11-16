from engine.query.rows.closed_prunable import ClosedPrunable
from engine.container.container import Container
from engine.driver.agent_hook import AgentHook
from engine.driver.block_check import BlockCheck
from engine.module.block_conditions import BlockConditions
from dataclasses import dataclass

from engine.driver.count_down import COUNTDOWN_TOOL_USES
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.agent_message_type import AgentMessageType
from engine.model.model import Model
from engine.time.timestamp import Timestamp
from core.modules.drivers.models.support.tool_use_window import ToolUseWindow


OPEN_BLOCKS_REASON = "the open blocks of one agent are few: each is closed or skipped before the agent goes on"


@dataclass(frozen=True, kw_only=True)
class AgentBlock(ClosedPrunable, Model):
    """An agent held from all but reading and journal commands: the line its refused tools are told, what ends
    the block and when it ended. A block with a grace holds only after that many tool uses or seconds, says
    its countdown line meanwhile, and may be skipped with a reason; so may a block declared skippable. A block
    that holds the stop only leaves the agent's tools alone."""

    kept_rows = 5000

    model_name = "agent_block"
    plugin_row_fields = ("blocks_stop",)
    cli_name = "agent-block"

    session_agent_id: int
    creator_id: int
    agent_message_key: str
    agent_message_text: str
    condition_name: str
    condition_text: str
    closed_at: Timestamp | None = None
    grace_tool_uses: int = 0
    grace_seconds: int = 0
    countdown_key: str = ""
    countdown_text: str = ""
    skip_reason: str = ""
    strict: bool = False
    is_skippable: bool = False
    countdown_limit: int = COUNTDOWN_TOOL_USES
    scope_tools: bool = True
    scope_stop: bool = False
    stop_grace_seconds: int = 0
    tool_selector: str = ""
    subject_model: str = ""
    subject_id: int | None = None
    members: tuple[int, ...] = ()
    context_generation: int | None = None
    condition_schema: int = 1
    lifting_lines: tuple[str, ...] = ()
    ends: tuple[str, ...] = ()
    closer_roles: tuple[str, ...] = ()
    expires_at: Timestamp | None = None
    escalation_id: int | None = None
    opener: str = ""
    opening_event_id: str = ""
    closed_reason: str = ""
    closer: str = ""
    closing_evidence: str = ""

    @property
    def blocks_stop(self) -> bool:
        return self.scope_stop and not self.scope_tools

    # The block's condition holds, or the row it waits on is gone, so it could never hold.
    def is_finished(self, conditions: BlockConditions, hook: AgentHook, container: Container) -> bool:
        condition = conditions.built(self.condition_name, self.condition_text)
        return not condition.has_target(container) or condition.is_true(BlockCheck(hook, self.creation_timestamp(), container))

    def is_active(self, tool_uses: int, timestamp: Timestamp) -> bool:
        if not self.scope_tools:
            return False
        if not self.grace_tool_uses and not self.grace_seconds:
            return True
        return bool((self.grace_tool_uses and tool_uses >= self.grace_tool_uses)
                    or (self.grace_seconds and self.creation_timestamp().elapsed_seconds(timestamp) >= self.grace_seconds))

    # A strict block refuses the skip of its own refusal too, so its refusal offers none and names only the command that
    # ends it.
    @property
    def refusal_type(self) -> AgentMessageType:
        return AgentMessageType.SAFETY_REFUSAL if self.strict else AgentMessageType.REFUSAL

    # the refusal's text names the block by its number, which only the saved row knows
    @property
    def refusal_text(self) -> str:
        return self.agent_message_text.replace("{block}", str(self.id))

    @property
    def grace(self) -> Interval | None:
        spans = [span for span in (ToolUseWindow(self.grace_tool_uses), Seconds(self.grace_seconds)) if span.count]
        return Interval(*spans) if spans else None

