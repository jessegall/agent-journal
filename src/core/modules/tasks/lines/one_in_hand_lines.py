from core.modules.drivers.support.rule_line_source import RuleLineSource
from core.modules.tasks.rules.task_start_rule import TaskStartRule


class OneInHandLines(RuleLineSource):
    """The lines of a task started with one in hand, in today's words of TaskStartRule."""

    rule = TaskStartRule
