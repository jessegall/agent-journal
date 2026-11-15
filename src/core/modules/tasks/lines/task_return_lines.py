from engine.rule_backed.rule_line_source import RuleLineSource
from core.modules.tasks.rules.task_return_line_rule import TaskReturnLineRule


class TaskReturnLines(RuleLineSource):
    """The line that tells an agent which task it holds when it gets control back, in today's words of TaskReturnLineRule."""

    rule = TaskReturnLineRule
