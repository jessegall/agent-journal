from engine.rule_backed.rule_effect import RuleEffect
from core.modules.pins.rules.agent_text_pin_rule import AgentTextPinRule


class AgentTextPinEffect(RuleEffect):
    """The effect of AgentTextPinRule, as today's rule runs it."""

    rule = AgentTextPinRule
