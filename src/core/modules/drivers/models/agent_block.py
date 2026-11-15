from engine.query.rows.closed_prunable import ClosedPrunable
from engine.container.container import Container
from engine.driver.agent_hook import AgentHook
from engine.driver.block_check import BlockCheck
from engine.module.block_conditions import BlockConditions
from dataclasses import dataclass

from engine.driver.count_down import COUNTDOWN_TOOL_USES
from engine.driver.interval import Interval
from engine.driver.seconds import Seconds
from engine.enums.nudge_type import NudgeType
from engine.model.model import Model
from engine.time.timestamp import Timestamp
from core.modules.drivers.models.support.tool_use_span import ToolUseSpan


OPEN_BLOCKS_REASON = "the open blocks of one agent are few: each is closed or skipped before the agent goes on"


@dataclass(frozen=True, kw_only=True)
class AgentBlock(ClosedPrunable, Model):
    """An agent held from all but reading and journal commands: the line its refused tools are told, what ends
    the block and when it ended. A block with a grace holds only after that many tool uses or seconds, says
    its countdown line meanwhile, and may be skipped with a reason; so may a block declared skippable. A block
    that holds the stop only leaves the agent's tools alone."""

    kept_rows = 5000

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
    countdown_limit: int = COUNTDOWN_TOOL_USES
    scope_tools: bool | None = None
    scope_stop: bool | None = None
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
    judgement: str = ""
    judgement_reason: str = ""
    escalation_id: int | None = None
    opener: str = ""
    opening_firing: str = ""
    closed_reason: str = ""
    closer: str = ""
    closing_evidence: str = ""

    # A row old code wrote has no scopes yet: blocks_stop says which one it has (doc 1310 section 4.5).
    @property
    def has_tool_scope(self) -> bool:
        return self.scope_tools if self.scope_tools is not None else not self.blocks_stop

    @property
    def has_stop_scope(self) -> bool:
        return self.scope_stop if self.scope_stop is not None else self.blocks_stop

    # The block's condition holds, or the row it waits on is gone, so it could never hold.
    def is_finished(self, conditions: BlockConditions, hook: AgentHook, container: Container) -> bool:
        condition = conditions.built(self.condition_name, self.condition_text)
        return not condition.has_target(container) or condition.is_true(BlockCheck(hook, self.creation_timestamp(), container))

    def is_active(self, tool_uses: int, timestamp: Timestamp) -> bool:
        if self.blocks_stop:
            return False
        if not self.grace_tool_uses and not self.grace_seconds:
            return True
        return bool((self.grace_tool_uses and tool_uses >= self.grace_tool_uses)
                    or (self.grace_seconds and self.creation_timestamp().elapsed_seconds(timestamp) >= self.grace_seconds))

    # A strict block refuses the skip of its own refusal too, so its refusal offers none and names only the command that
    # ends it.
    @property
    def refusal_type(self) -> NudgeType:
        return NudgeType.SAFETY_REFUSAL if self.strict else NudgeType.REFUSAL

    @property
    def grace(self) -> Interval | None:
        spans = [span for span in (ToolUseSpan(self.grace_tool_uses), Seconds(self.grace_seconds)) if span.count]
        return Interval(*spans) if spans else None

