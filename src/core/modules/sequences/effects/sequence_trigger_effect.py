from core.modules.drivers.support.rule_effect import RuleEffect
from core.modules.sequences.rules.sequence_trigger_rule import SequenceTriggerRule


class SequenceTriggerEffect(RuleEffect):
    """The effect of SequenceTriggerRule, as today's rule runs it."""

    rule = SequenceTriggerRule
