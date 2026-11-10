from engine.container.container import Container
from engine.enums.role_group import RoleGroup
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.nudge import Nudge
from core.base.driver.nudge_type import NudgeType
from core.base.driver.rule_answer import RuleAnswer
from core.base.module.block_conditions import BlockConditions
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.modules.drivers.commands.close_agent_block.close_agent_block import CloseAgentBlock
from core.modules.drivers.models.agent_block import AgentBlock, OPEN_BLOCKS_REASON


class BlockStopRule(DriverRule):
    """An agent's stop is refused while a block that holds the stop only is still open; a block whose condition is
    true ends here."""

    name = "drivers.block-stop"
    hook = HookEventName.STOP
    drivers = ["*"]
    role_group = RoleGroup.PROMPT
    refuses_one_action = "An agent's stop is refused while a block that holds the stop only is still open"

    def __init__(self, queries: Queries, conditions: BlockConditions, container: Container) -> None:
        self.queries, self.conditions, self.container = queries, conditions, container

    def answer(self, hook: AgentHook) -> RuleAnswer:
        blocks = tuple(self.queries.query(AgentBlock).filter(session_agent_id=hook.agent_id, blocks_stop=True).matching(IsNull("closed_at")).oldest().full_table(OPEN_BLOCKS_REASON).all_rows())
        finished = [block for block in blocks if block.is_finished(self.conditions, hook, self.container)]
        waiting = [block for block in blocks if block not in finished]
        closing = [CloseAgentBlock(block.id) for block in finished]
        if not waiting:
            return RuleAnswer.allowed("no unfinished stop block holds the agent").running(*closing)
        return RuleAnswer.refused(Nudge(waiting[0].nudge_key, NudgeType.REFUSAL, waiting[0].nudge_text)).running(*closing)
