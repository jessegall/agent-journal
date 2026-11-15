from engine.rule_backed.rule_effect import RuleEffect
from core.modules.reminders.rules.due_reminder_rule import DueReminderRule


class DueReminderEffect(RuleEffect):
    """The effect of DueReminderRule, as today's rule runs it."""

    rule = DueReminderRule
