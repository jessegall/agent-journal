from engine.rule_backed.rule_policy import RulePolicy
from suites.coding.modules.workers.rules.worker_reuse_rule import WorkerReuseRule


class WorkerReusePolicy(RulePolicy):
    """The refusal of WorkerReuseRule, with today's text, as a policy of the new driver."""

    rule = WorkerReuseRule
    rank = "workers.policies"
