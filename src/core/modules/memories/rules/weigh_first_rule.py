from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.memories.support.block_conditions.memories_weighed import MemoriesWeighed
from core.modules.memories.support.memory_nudges import WEIGH_FIRST


class WeighFirstRule(DriverRule):
    """While a memory mark is open the agent is blocked, so it weighs, makes, corrects or removes a memory, or
    skips with a reason."""

    name = "memories.weigh-first"
    hook = HookEventName.PRE_TOOL_USE

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.blocked(hook, WEIGH_FIRST.nudge(), MemoriesWeighed())
