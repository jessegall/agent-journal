from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.memories.nudges.weigh_first_nudge import WeighFirstNudge


class WeighFirstStopRule(DriverRule):
    """While a memory mark is open, a stop is refused with the way to weigh or skip."""

    name = "memories.weigh-first-stop"
    hook = HookEventName.STOP
    single_action_refusal = "While a memory mark is open, a stop is refused with the way to weigh or skip"

    def answer(self, hook: AgentHook) -> RuleAnswer:
        return RuleAnswer.refused(WeighFirstNudge.declared().nudge())
