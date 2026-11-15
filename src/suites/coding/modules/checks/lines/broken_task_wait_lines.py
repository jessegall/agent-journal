from engine.rule_backed.rule_line_source import RuleLineSource
from suites.coding.modules.checks.rules.broken_task_wait_rule import BrokenTaskWaitRule


class BrokenTaskWaitLines(RuleLineSource):
    """The lines of BrokenTaskWaitRule, in today's words."""

    rule = BrokenTaskWaitRule
