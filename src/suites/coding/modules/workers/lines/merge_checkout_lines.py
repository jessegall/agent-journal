from engine.rule_backed.rule_line_source import RuleLineSource
from suites.coding.modules.workers.rules.merge_checkout_rule import MergeCheckoutRule


class MergeCheckoutLines(RuleLineSource):
    """The lines of MergeCheckoutRule, in today's words."""

    rule = MergeCheckoutRule
