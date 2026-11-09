from collections.abc import Sequence
from core.base.role_group import RoleGroup
from core.base.container import Container
from core.base.driver.agent_hook import AgentHook
from core.base.module.block_conditions import BlockConditions
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.nudge import Nudge
from core.base.driver.nudge_type import NudgeType
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.tool import Tool
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.drivers.commands.close_agent_block.close_agent_block import CloseAgentBlock
from core.modules.drivers.models.agent_block import AgentBlock
from core.base.driver.tool_type import ToolType
from core.modules.drivers.queries.hook_call_query import HookCallQuery


class AgentBlockRule(DriverRule):
    """A blocked agent's tools are refused but for reading and journal commands; a block ends as soon as its
    condition is true. A block with a grace holds only once the grace has passed, and in its last tool uses
    says how many are remaining."""

    name = "drivers.agent-block"
    exempt = True
    overlay_proof = True
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    role_group = RoleGroup.PROMPT
    tools = tuple(ToolType)
    refuses_one_action = "A blocked agent's tools are refused but for reading and journal commands"

    def __init__(self, queries: Queries, conditions: BlockConditions, container: Container, calls: HookCallQuery) -> None:
        self.queries, self.conditions, self.container = queries, conditions, container
        self.calls = calls

    def answer(self, hook: AgentHook) -> RuleAnswer:
        blocks = tuple(self.queries.query(AgentBlock).filter(session_agent_id=hook.agent_id).matching(IsNull("closed_at")).oldest().all_rows())
        if not blocks:
            return RuleAnswer.allowed()
        finished_blocks = self.finished(blocks, hook)
        waiting_blocks = [block for block in blocks if block not in finished_blocks]
        counted_blocks = [block for block in waiting_blocks if block.grace_tool_uses]
        counts = self.calls.tool_use_counts(hook.agent_id, [block.creation_timestamp() for block in counted_blocks]) if counted_blocks else []
        tool_uses = dict(zip([block.id for block in counted_blocks], counts))
        active_blocks = [block for block in waiting_blocks if block.is_active(tool_uses.get(block.id, 0), hook.timestamp)]
        tool = hook.event.tool
        closing = [CloseAgentBlock(block.id) for block in finished_blocks]
        refused_blocks = [block for block in active_blocks if tool is not None and self.refuses(block, tool)]
        if refused_blocks:
            return RuleAnswer.refused(Nudge(refused_blocks[0].nudge_key, NudgeType.REFUSAL, refused_blocks[0].nudge_text.replace("{block}", str(refused_blocks[0].id)))).running_unrefused(*closing)
        countdowns = [self.countdown(block, tool_uses.get(block.id, 0)) for block in waiting_blocks if block not in active_blocks]
        return RuleAnswer.with_nudges(*[nudge for nudge in countdowns if nudge is not None]).running_unrefused(*closing)

    def finished(self, blocks: Sequence[AgentBlock], hook: AgentHook) -> list[AgentBlock]:
        answers: dict[tuple[str, str, str], bool] = {}
        finished_blocks: list[AgentBlock] = []
        for block in blocks:
            condition = (block.condition_name, block.condition_text, block.creation_timestamp().text)
            if condition not in answers:
                answers[condition] = block.is_finished(self.conditions, hook, self.container)
            if answers[condition]:
                finished_blocks.append(block)
        return finished_blocks

    def refuses(self, block: AgentBlock, tool: Tool) -> bool:
        return not tool.is_skill_read if block.strict else not tool.block_exempt

    def countdown(self, block: AgentBlock, tool_uses: int) -> Nudge | None:
        if not block.countdown_text or not block.grace_tool_uses:
            return None
        remaining = block.grace_tool_uses - tool_uses - 1
        return Nudge(block.countdown_key, NudgeType.STEERING, block.countdown_text.replace("{left}", str(remaining)), turn_limited=False) if 0 <= remaining < block.countdown_limit else None
