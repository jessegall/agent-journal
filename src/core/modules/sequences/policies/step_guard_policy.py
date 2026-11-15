from core.modules.drivers.support.rule_policy import RulePolicy
from core.modules.sequences.rules.step_guard_rule import StepGuardRule


class StepGuardPolicy(RulePolicy):
    """The refusal of StepGuardRule, with today's text, as a policy of the new driver."""

    rule = StepGuardRule
    rank = "sequences.policies"
