from engine.rule_backed.rule_line_source import RuleLineSource
from core.modules.reminders.rules.due_reminder_rule import DueReminderRule


class DueReminderLines(RuleLineSource):
    """The lines of DueReminderRule, in today's words."""

    rule = DueReminderRule
