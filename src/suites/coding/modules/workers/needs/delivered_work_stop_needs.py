from core.modules.drivers.support.rule_need_source import RuleNeedSource
from suites.coding.modules.workers.rules.delivered_work_stop_rule import DeliveredWorkStopRule


class DeliveredWorkStopNeeds(RuleNeedSource):
    """The block DeliveredWorkStopRule opens, planned for the new driver as today's rule opens it."""

    rule = DeliveredWorkStopRule
    rank = "workers.delivered-proofs"
