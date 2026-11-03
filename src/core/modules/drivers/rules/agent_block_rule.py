from core.base.agent_role import AgentRole
from core.base.container import Container
from core.base.driver.agent_hook import AgentHook
from core.base.driver.block_check import BlockCheck
from core.base.module.block_conditions import BlockConditions
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.nudge import Nudge
from core.base.driver.nudge_type import NudgeType
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.drivers.commands.close_agent_block.close_agent_block import CloseAgentBlock
from core.modules.drivers.models.agent_block import AgentBlock
from core.modules.drivers.support.tool_use_count import ToolUseCount

COUNTDOWN_USES = 3


class AgentBlockRule(DriverRule):
    """A blocked agent's tools are refused but for reading and journal commands; a block ends as soon as its
    condition is true. A block with a grace holds only once the grace has passed, and in its last tool uses says
    how many are left."""

    name = "drivers.agent-block"
    exempt = True
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, queries: Queries, conditions: BlockConditions, container: Container) -> None:
        self.queries, self.conditions, self.container = queries, conditions, container

    def answer(self, hook: AgentHook) -> RuleAnswer:
        blocks = tuple(self.queries.query(AgentBlock).filter(agent_id=hook.agent_id).matching(IsNull("closed_at")).oldest().all_rows())
        if not blocks:
            return RuleAnswer.allowed()
        finished_blocks = [block for block in blocks if self.is_finished(block, hook)]
        waiting_blocks = [block for block in blocks if block not in finished_blocks]
        holding_blocks = [block for block in waiting_blocks if self.is_holding(block, hook)]
        tool = hook.event.tool
        closing = [CloseAgentBlock(block.id) for block in finished_blocks]
        if holding_blocks and tool is not None and not tool.block_exempt:
            return RuleAnswer.refused(Nudge(holding_blocks[0].nudge_key, NudgeType.REFUSAL, holding_blocks[0].nudge_text.replace("{block}", str(holding_blocks[0].id)))).running(*closing)
        countdowns = [self.countdown(block, hook) for block in waiting_blocks if block not in holding_blocks]
        return RuleAnswer.with_nudges(*[nudge for nudge in countdowns if nudge is not None]).running(*closing)

    def is_finished(self, block: AgentBlock, hook: AgentHook) -> bool:
        return self.conditions.built(block.condition_name, block.condition_text).is_true(BlockCheck(hook, block.creation_timestamp(), self.container))

    def is_holding(self, block: AgentBlock, hook: AgentHook) -> bool:
        return block.grace is None or block.grace.has_passed(self.queries, hook.agent_id, block.creation_timestamp(), hook.timestamp)

    def countdown(self, block: AgentBlock, hook: AgentHook) -> Nudge | None:
        if not block.countdown_text or not block.grace_tool_uses:
            return None
        left = block.grace_tool_uses - ToolUseCount.after_timestamp(self.queries, hook.agent_id, block.creation_timestamp()) - 1
        return Nudge(block.countdown_key, NudgeType.STEERING, block.countdown_text.replace("{left}", str(left)), turn_limited=False) if 0 <= left < COUNTDOWN_USES else None
