from engine.rule_backed.rule_line_source import RuleLineSource
from core.modules.tasks.rules.task_return_reminder_rule import TaskReturnReminderRule


class StillHeldLines(RuleLineSource):
    """The lines of a task still held, in today's words of TaskReturnReminderRule."""

    rule = TaskReturnReminderRule
