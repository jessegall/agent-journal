from engine.rule_backed.rule_policy import RulePolicy
from core.modules.drivers.rules.foreign_hooks_rule import ForeignHooksRule


class ForeignHooksPolicy(RulePolicy):
    """The refusal of ForeignHooksRule, with today's text, as a policy of the new driver."""

    rule = ForeignHooksRule
    rank = "drivers.policies"
