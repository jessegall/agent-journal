from engine.rule_backed.rule_line_source import RuleLineSource
from suites.coding.modules.workers.rules.workers_out_rule import WorkersOutRule


class WorkersOutLines(RuleLineSource):
    """The lines of WorkersOutRule, in today's words."""

    rule = WorkersOutRule
