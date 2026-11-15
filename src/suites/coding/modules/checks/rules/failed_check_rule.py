from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.agent_role import AgentRole
from engine.enums.hook_wildcard import HookWildcard
from suites.coding.modules.checks.effects.failed_check_effect import FailedCheckEffect
from suites.coding.modules.checks.lines.failed_check_lines import FAILED_CHECK_RULE, FailedCheckLines


class FailedCheckRule(DriverRule):
    """The old walk's answer for FailedCheckLines and FailedCheckEffect, which own it, until the walk is deleted."""

    name = FAILED_CHECK_RULE
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN]
    overlay_proof = True
    is_notice = True

    def __init__(self, lines: FailedCheckLines, effect: FailedCheckEffect) -> None:
        self.lines, self.effect = lines, effect

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudges = self.lines.nudges(hook.event, hook.agent_id)
        if not nudges:
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(*nudges).running(*self.effect.commands_of(hook.event, hook.agent_id))
