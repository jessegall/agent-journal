from core.modules.drivers.support.rule_policy import RulePolicy
from core.modules.processes.rules.retry_loop_rule import RetryLoopRule


class RetryLoopPolicy(RulePolicy):
    """The refusal of RetryLoopRule, with today's text, as a policy of the new driver."""

    rule = RetryLoopRule
    rank = "shell.all"
