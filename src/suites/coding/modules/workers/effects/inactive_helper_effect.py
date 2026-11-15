from engine.rule_backed.rule_effect import RuleEffect
from suites.coding.modules.workers.rules.inactive_helper_rule import InactiveHelperRule


class InactiveHelperEffect(RuleEffect):
    """The effect of InactiveHelperRule, as today's rule runs it."""

    rule = InactiveHelperRule
