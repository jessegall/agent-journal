from engine.rule_backed.rule_effect import RuleEffect
from core.modules.triggers.rules.scheduled_trigger_rule import ScheduledTriggerRule


class ScheduledTriggerEffect(RuleEffect):
    """The effect of ScheduledTriggerRule, as today's rule runs it."""

    rule = ScheduledTriggerRule
