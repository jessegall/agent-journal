from core.modules.drivers.support.rule_policy import RulePolicy
from core.modules.sequences.rules.step_command_rule import StepCommandRule


class StepCommandPolicy(RulePolicy):
    """The refusal of StepCommandRule, with today's text, as a policy of the new driver."""

    rule = StepCommandRule
    rank = "sequences.policies"
