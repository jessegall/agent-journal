from core.modules.drivers.support.rule_need_source import RuleNeedSource
from suites.coding.drivers.worker.rules.worker_task_start_rule import WorkerTaskStartRule


class WorkerTaskStartNeeds(RuleNeedSource):
    """The block WorkerTaskStartRule opens, planned for the new driver as today's rule opens it."""

    rule = WorkerTaskStartRule
    rank = "workers.no-task"
