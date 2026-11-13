from engine.helper_type.helper_type_book import HelperTypeBook
from core.modules.drivers.support.driver_nudges import REPEATED_STOP
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.driver.stop_blockers import StopBlockers
from core.modules.drivers.queries.hook_call_query import HookCallQuery

STOP_REFUSAL_COUNT = 5


class RepeatedStopReleaseRule(DriverRule):
    """Releases repeated stop refusals unless the suite requires that role to finish its work, or a running
    sequence holds the agent."""

    name = "drivers.repeated-stop-release"
    hook = HookEventName.STOP
    drivers = ["*"]
    essential = True

    def __init__(self, calls: HookCallQuery, types: HelperTypeBook, work: StopBlockers) -> None:
        self.calls, self.types, self.work = calls, types, work

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if self.types.behaviours(hook.role).stops_are_checked or self.calls.stop_refusal_count(hook.agent_id) < STOP_REFUSAL_COUNT or self.work.is_running(hook.agent_id):
            return RuleAnswer.allowed("the agent must finish its work or has fewer than five refused stops")
        return RuleAnswer.final_allowance(REPEATED_STOP.nudge())
