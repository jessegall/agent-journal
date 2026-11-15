from engine.rule_backed.rule_policy import RulePolicy
from suites.coding.modules.workers.rules.phase_test_rule import PhaseTestRule


class PhaseTestPolicy(RulePolicy):
    """The refusal of PhaseTestRule, with today's text, as a policy of the new driver."""

    rule = PhaseTestRule
    rank = "workers.policies"
