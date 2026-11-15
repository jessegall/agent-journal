from core.modules.drivers.support.rule_need_source import RuleNeedSource
from suites.coding.modules.workers.rules.worker_status_first_rule import WorkerStatusFirstRule


class WorkerStatusFirstNeeds(RuleNeedSource):
    """The block WorkerStatusFirstRule opens, planned for the new driver as today's rule opens it."""

    rule = WorkerStatusFirstRule
    rank = "workers.status-first"
