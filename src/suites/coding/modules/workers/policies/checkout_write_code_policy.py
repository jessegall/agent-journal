from engine.rule_backed.rule_policy import RulePolicy
from suites.coding.modules.workers.rules.checkout_write_code_rule import CheckoutWriteCodeRule


class CheckoutWriteCodePolicy(RulePolicy):
    """The refusal of CheckoutWriteCodeRule, with today's text, as a policy of the new driver."""

    rule = CheckoutWriteCodeRule
    rank = "access.all"
