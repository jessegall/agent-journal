from core.modules.drivers.support.driver_nudges import REPEATED_STOP
from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.drivers.queries.hook_call_query import HookCallQuery

STOP_REFUSAL_COUNT = 5


class RepeatedStopReleaseRule(DriverRule):
    """A stop of a helper refused five times in a row goes through the next time, with a line
    asking it to report what held it, so no rule and no overlay holds a helper for ever; the
    main agent is never released, since it stops only when its tasks are done."""

    name = "drivers.repeated-stop-release"
    hook = HookEventName.STOP
    drivers = ["*"]
    essential = True

    def __init__(self, calls: HookCallQuery) -> None:
        self.calls = calls

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if hook.role is AgentRole.MAIN or self.calls.stop_refusal_count(hook.agent_id) < STOP_REFUSAL_COUNT:
            return RuleAnswer.allowed()
        return RuleAnswer.final_allowance(REPEATED_STOP.nudge())
