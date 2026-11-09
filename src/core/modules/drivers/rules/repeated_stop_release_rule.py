from core.modules.drivers.support.driver_nudges import REPEATED_STOP
from core.modules.drivers.support.suite_choice import SuiteChoice
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.stop_blockers import StopBlockers
from core.modules.drivers.queries.hook_call_query import HookCallQuery

STOP_REFUSAL_COUNT = 5


class RepeatedStopReleaseRule(DriverRule):
    """Releases repeated stop refusals unless the suite requires that role to finish its work, or a running
    sequence holds the agent."""

    name = "drivers.repeated-stop-release"
    hook = HookEventName.STOP
    drivers = ["*"]
    essential = True

    def __init__(self, calls: HookCallQuery, suites: SuiteChoice, work: StopBlockers) -> None:
        self.calls, self.suites, self.work = calls, suites, work

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if hook.role in self.suites.agent_policy().stop_required_roles or self.calls.stop_refusal_count(hook.agent_id) < STOP_REFUSAL_COUNT or self.work.is_running(hook.agent_id):
            return RuleAnswer.allowed("the agent must finish its work or has fewer than five refused stops")
        return RuleAnswer.final_allowance(REPEATED_STOP.nudge())
