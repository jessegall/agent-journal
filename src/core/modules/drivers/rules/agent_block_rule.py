from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.nudge import Nudge
from core.base.driver.nudge_type import NudgeType
from core.base.driver.rule_answer import RuleAnswer
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.drivers.commands.close_agent_block.close_agent_block import CloseAgentBlock
from core.modules.drivers.models.agent_block import AgentBlock


class AgentBlockRule(DriverRule):
    """A blocked agent's tools are refused but for reading and journal commands; a block ends as soon as what
    ends it is true."""

    name = "drivers.agent-block"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def answer(self, hook: AgentHook) -> RuleAnswer:
        blocks = tuple(self.queries.query(AgentBlock).filter(agent_id=hook.agent_id).matching(IsNull("closed_at")).oldest().all_rows())
        if not blocks:
            return RuleAnswer.allowed()
        finished_blocks = [block for block in blocks if block.condition.is_true(hook)]
        waiting_blocks = [block for block in blocks if block not in finished_blocks]
        tool = hook.event.tool
        if waiting_blocks and tool is not None and not (tool.is_reading or tool.is_journal_line):
            refusal = Nudge(waiting_blocks[0].nudge_key, NudgeType.REFUSAL, waiting_blocks[0].nudge_text)
            return RuleAnswer.refused(refusal).running(*(CloseAgentBlock(block.id) for block in finished_blocks))
        return RuleAnswer.allowed().running(*(CloseAgentBlock(block.id) for block in finished_blocks))
