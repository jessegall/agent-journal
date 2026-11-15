from core.modules.drivers.support.rule_effect import RuleEffect
from core.modules.pins.rules.link_pin_rule import LinkPinRule


class LinkPinEffect(RuleEffect):
    """The effect of LinkPinRule, as today's rule runs it."""

    rule = LinkPinRule
