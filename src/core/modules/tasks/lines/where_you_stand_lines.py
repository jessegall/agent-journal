from core.modules.drivers.support.rule_line_source import RuleLineSource
from core.modules.tasks.rules.task_return_line_rule import TaskReturnLineRule


class WhereYouStandLines(RuleLineSource):
    """The lines of where the agent stands, in today's words of TaskReturnLineRule."""

    rule = TaskReturnLineRule
