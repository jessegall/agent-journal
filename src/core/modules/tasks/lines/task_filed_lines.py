from engine.rule_backed.rule_line_source import RuleLineSource
from core.modules.tasks.rules.task_filed_rule import TaskFiledRule


class TaskFiledLines(RuleLineSource):
    """The lines of a task just filed, in today's words of TaskFiledRule."""

    rule = TaskFiledRule
