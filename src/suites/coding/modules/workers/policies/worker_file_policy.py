from engine.rule_backed.rule_policy import RulePolicy
from suites.coding.modules.workers.rules.worker_file_rule import WorkerFileRule


class WorkerFilePolicy(RulePolicy):
    """The refusal of WorkerFileRule, with today's text, as a policy of the new driver."""

    rule = WorkerFileRule
    rank = "access.all"
