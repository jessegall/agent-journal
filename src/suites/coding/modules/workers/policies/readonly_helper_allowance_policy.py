from engine.rule_backed.rule_policy import RulePolicy
from suites.coding.modules.workers.rules.readonly_helper_allowance_rule import ReadonlyHelperAllowanceRule


class ReadonlyHelperAllowancePolicy(RulePolicy):
    """The refusal of ReadonlyHelperAllowanceRule, with today's text, as a policy of the new driver."""

    rule = ReadonlyHelperAllowanceRule
    rank = "workers.policies"
