from engine.rule_backed.rule_line_source import RuleLineSource
from suites.coding.modules.workers.rules.inactive_helper_rule import InactiveHelperRule


class InactiveHelperLines(RuleLineSource):
    """The lines of InactiveHelperRule, in today's words."""

    rule = InactiveHelperRule
