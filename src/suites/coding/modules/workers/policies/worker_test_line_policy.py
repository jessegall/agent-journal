from engine.rule_backed.rule_policy import RulePolicy
from suites.coding.modules.workers.rules.worker_test_line_rule import WorkerTestLineRule


class WorkerTestLinePolicy(RulePolicy):
    """The refusal of WorkerTestLineRule, with today's text, as a policy of the new driver."""

    rule = WorkerTestLineRule
    rank = "workers.policies"
