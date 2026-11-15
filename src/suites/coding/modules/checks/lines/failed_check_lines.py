from engine.rule_backed.rule_line_source import RuleLineSource
from suites.coding.modules.checks.rules.failed_check_rule import FailedCheckRule


class FailedCheckLines(RuleLineSource):
    """The lines of FailedCheckRule, in today's words."""

    rule = FailedCheckRule
