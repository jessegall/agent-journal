from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.modules.drivers.queries.hook_call_query import HookCallQuery

STOP_REFUSAL_COUNT = 5


class RepeatedStopReleaseRule(DriverRule):
    """A stop refused five times in a row goes through the next time, with a line asking the agent to report
    what held it, so no rule and no overlay holds an agent for ever."""

    name = "drivers.repeated-stop-release"
    hook = HookEventName.STOP
    drivers = ["*"]
    essential = True

    def __init__(self, calls: HookCallQuery) -> None:
        self.calls = calls

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if self.calls.stop_refusal_count(hook.agent_id) < STOP_REFUSAL_COUNT:
            return RuleAnswer.allowed()
        return RuleAnswer.final_allowance("your stop was refused five times in a row: report what held it with journal report create")
