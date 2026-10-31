from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from suites.coding.modules.checks.commands.support.check_lines import CheckLines
from suites.coding.modules.checks.commands.report_check import ReportCheck
from suites.coding.modules.checks.queries.check_query import CheckQuery

REPEAT_MINUTES = 60


class FailedCheckRule(DriverRule):
    """The main agent is told once that a check fails, with the last 800 characters it printed, and again after an
    hour if it still fails."""

    name = "checks.failed"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, checks: CheckQuery) -> None:
        self.checks = checks

    def answer(self, hook: AgentHook) -> RuleAnswer:
        failing = self.checks.unreported(hook.timestamp, REPEAT_MINUTES)
        if not failing:
            return RuleAnswer.allowed()
        return RuleAnswer.with_lines(*(CheckLines.report_text(check) for check in failing)).running(*(ReportCheck(check.id) for check in failing))
