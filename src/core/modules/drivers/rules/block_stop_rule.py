from engine.container.container import Container
from engine.agent.enums.role_group import RoleGroup
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.nudge import Nudge
from engine.enums.nudge_type import NudgeType
from engine.driver.rule_answer import RuleAnswer
from engine.module.block_conditions import BlockConditions
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from core.modules.drivers.commands.close_agent_block.close_agent_block import CloseAgentBlock
from core.modules.drivers.models.agent_block import AgentBlock, OPEN_BLOCKS_REASON


class BlockStopRule(DriverRule):
    """An agent's stop is refused while a block that holds the stop only is still open; a block whose condition is
    true ends here."""

    name = "drivers.block-stop"
    hook = HookEventName.STOP
    drivers = ["*"]
    role_group = RoleGroup.PROMPT
    single_action_refusal = "An agent's stop is refused while a block that holds the stop only is still open"

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
