from engine.rule_backed.rule_policy import RulePolicy
from suites.coding.modules.workers.rules.worker_read_rule import WorkerReadRule


class WorkerReadPolicy(RulePolicy):
    """The refusal of WorkerReadRule, with today's text, as a policy of the new driver."""

    rule = WorkerReadRule
    rank = "access.all"
