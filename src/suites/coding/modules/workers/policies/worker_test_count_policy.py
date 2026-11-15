from engine.rule_backed.rule_policy import RulePolicy
from suites.coding.modules.workers.rules.worker_test_count_rule import WorkerTestCountRule


class WorkerTestCountPolicy(RulePolicy):
    """The refusal of WorkerTestCountRule, with today's text, as a policy of the new driver."""

    rule = WorkerTestCountRule
    rank = "shell.all"
