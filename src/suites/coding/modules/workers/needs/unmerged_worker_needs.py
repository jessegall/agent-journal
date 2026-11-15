from core.modules.drivers.support.rule_need_source import RuleNeedSource
from suites.coding.modules.workers.rules.unmerged_worker_rule import UnmergedWorkerRule


class UnmergedWorkerNeeds(RuleNeedSource):
    """The block UnmergedWorkerRule opens, planned for the new driver as today's rule opens it."""

    rule = UnmergedWorkerRule
    rank = "workers.unmerged"
