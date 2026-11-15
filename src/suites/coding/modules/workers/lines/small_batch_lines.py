from engine.rule_backed.rule_line_source import RuleLineSource
from suites.coding.modules.workers.rules.small_batch_rule import SmallBatchRule


class SmallBatchLines(RuleLineSource):
    """The lines of SmallBatchRule, in today's words."""

    rule = SmallBatchRule
