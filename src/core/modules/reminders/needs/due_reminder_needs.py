from core.modules.drivers.support.rule_need_source import RuleNeedSource
from core.modules.reminders.rules.due_reminder_rule import DueReminderRule


class DueReminderNeeds(RuleNeedSource):
    """The block DueReminderRule opens, planned for the new driver as today's rule opens it."""

    rule = DueReminderRule
    rank = "reminders.due"
