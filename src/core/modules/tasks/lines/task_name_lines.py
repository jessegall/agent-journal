from engine.rule_backed.rule_line_source import RuleLineSource
from core.modules.tasks.rules.task_name_rule import TaskNameRule


class TaskNameLines(RuleLineSource):
    """The lines of a task named in a command, in today's words of TaskNameRule."""

    rule = TaskNameRule
