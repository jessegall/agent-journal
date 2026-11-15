from engine.rule_backed.rule_line_source import RuleLineSource
from core.modules.tasks.rules.inactive_task_reminder_rule import InactiveTaskReminderRule


class QuietTaskLines(RuleLineSource):
    """The lines of a task left quiet, in today's words of InactiveTaskReminderRule."""

    rule = InactiveTaskReminderRule
