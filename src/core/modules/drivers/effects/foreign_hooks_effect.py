from core.modules.drivers.support.rule_effect import RuleEffect
from core.modules.drivers.rules.foreign_hooks_rule import ForeignHooksRule


class ForeignHooksEffect(RuleEffect):
    """The effect of ForeignHooksRule, as today's rule runs it."""

    rule = ForeignHooksRule
