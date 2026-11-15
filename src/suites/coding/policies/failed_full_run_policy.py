from engine.rule_backed.rule_policy import RulePolicy
from suites.coding.rules.failed_full_run_rule import FailedFullRunRule


class FailedFullRunPolicy(RulePolicy):
    """The refusal of FailedFullRunRule, with today's text, as a policy of the new driver."""

    rule = FailedFullRunRule
    rank = "shell.all"
