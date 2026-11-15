from engine.rule_backed.rule_effect import RuleEffect
from suites.coding.modules.workers.rules.phase_test_rule import PhaseTestRule


class PhaseTestEffect(RuleEffect):
    """The effect of PhaseTestRule, as today's rule runs it."""

    rule = PhaseTestRule
