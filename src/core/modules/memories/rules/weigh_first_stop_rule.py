from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.memories.support.memory_nudges import WEIGH_FIRST


class WeighFirstStopRule(DriverRule):
    """While a memory mark is open, a stop is refused with the way to weigh or skip."""

    name = "memories.weigh-first-stop"
    hook = HookEventName.STOP
    refuses_one_action = "While a memory mark is open, a stop is refused with the way to weigh or skip"

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.refused(WEIGH_FIRST.nudge())
