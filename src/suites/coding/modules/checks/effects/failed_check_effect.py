from engine.rule_backed.rule_effect import RuleEffect
from suites.coding.modules.checks.rules.failed_check_rule import FailedCheckRule


class FailedCheckEffect(RuleEffect):
    """The effect of FailedCheckRule, as today's rule runs it."""

    rule = FailedCheckRule
