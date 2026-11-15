from engine.rule_backed.rule_policy import RulePolicy
from suites.coding.modules.workers.rules.worker_outside_link_rule import WorkerOutsideLinkRule


class WorkerOutsideLinkPolicy(RulePolicy):
    """The refusal of WorkerOutsideLinkRule, with today's text, as a policy of the new driver."""

    rule = WorkerOutsideLinkRule
    rank = "access.all"
