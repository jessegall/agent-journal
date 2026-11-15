from engine.rule_backed.rule_line_source import RuleLineSource
from suites.coding.modules.workers.rules.stopped_worker_rule import StoppedWorkerRule


class StoppedWorkerLines(RuleLineSource):
    """The lines of StoppedWorkerRule, in today's words."""

    rule = StoppedWorkerRule
