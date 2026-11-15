from engine.rule_backed.rule_line_source import RuleLineSource
from suites.coding.modules.workers.rules.unmerged_worker_rule import UnmergedWorkerRule


class UnmergedWorkerLines(RuleLineSource):
    """The lines of UnmergedWorkerRule, in today's words."""

    rule = UnmergedWorkerRule
