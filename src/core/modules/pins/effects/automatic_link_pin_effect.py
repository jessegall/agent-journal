from engine.rule_backed.rule_effect import RuleEffect
from core.modules.pins.rules.automatic_link_pin_rule import AutomaticLinkPinRule


class AutomaticLinkPinEffect(RuleEffect):
    """The effect of AutomaticLinkPinRule, as today's rule runs it."""

    rule = AutomaticLinkPinRule
