from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from suites.coding.modules.checks.commands.run_check import RunCheck
from suites.coding.modules.checks.queries.check_query import CheckQuery


class DueCheckRule(DriverRule):
    """On any hook, the server's tick included, each check whose interval has passed since it last ran is run again."""

    name = "checks.due"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN]

    def __init__(self, checks: CheckQuery) -> None:
        self.checks = checks

    def answer(self, hook: AgentHook) -> RuleAnswer:
        due = self.checks.due(hook.timestamp)
        return RuleAnswer.allowed().running(*(RunCheck(check.id) for check in due)) if due else RuleAnswer.allowed()
