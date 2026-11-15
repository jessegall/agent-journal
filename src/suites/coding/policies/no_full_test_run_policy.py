from engine.rule_backed.rule_policy import RulePolicy
from suites.coding.rules.no_full_test_run_rule import NoFullTestRunRule


class NoFullTestRunPolicy(RulePolicy):
    """The refusal of NoFullTestRunRule, with today's text, as a policy of the new driver."""

    rule = NoFullTestRunRule
    rank = "shell.all"
