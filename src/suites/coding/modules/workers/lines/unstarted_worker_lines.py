from engine.rule_backed.rule_line_source import RuleLineSource
from suites.coding.modules.workers.rules.unstarted_worker_rule import UnstartedWorkerRule


class UnstartedWorkerLines(RuleLineSource):
    """The lines of UnstartedWorkerRule, in today's words."""

    rule = UnstartedWorkerRule
