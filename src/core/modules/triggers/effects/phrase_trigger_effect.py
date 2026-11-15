from engine.rule_backed.rule_effect import RuleEffect
from core.modules.triggers.rules.phrase_trigger_rule import PhraseTriggerRule


class PhraseTriggerEffect(RuleEffect):
    """The effect of PhraseTriggerRule, as today's rule runs it."""

    rule = PhraseTriggerRule
