from suites.coding.modules.checks.support.check_nudges import CHECK_FAILED
from suites.coding.support.coding_agent_role import CodingAgentRole as AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from suites.coding.modules.checks.commands.report_check.report_check import ReportCheck
from suites.coding.modules.checks.queries.check_query import CheckQuery

REPEAT_MINUTES = 60


class FailedCheckRule(DriverRule):
    """The main agent is told once that a check fails, also while it waits, with the last 800 characters it printed,
    and again after an hour if it still fails."""

    name = "checks.failed"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN]
    overlay_proof = True
    is_notice = True

    def __init__(self, checks: CheckQuery) -> None:
        self.checks = checks

    def answer(self, hook: AgentHook) -> RuleAnswer:
        failing = self.checks.unreported(hook.timestamp, REPEAT_MINUTES)
        if not failing:
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(*(CHECK_FAILED.nudge(check=check.id) for check in failing)).running(*(ReportCheck(check.id) for check in failing))
