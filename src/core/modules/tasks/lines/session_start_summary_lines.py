from engine.rule_backed.rule_line_source import RuleLineSource
from core.modules.tasks.rules.task_summary_line_rule import TaskSummaryLineRule


class SessionStartSummaryLines(RuleLineSource):
    """The lines of the tasks at a session start, in today's words of TaskSummaryLineRule."""

    rule = TaskSummaryLineRule
