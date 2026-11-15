from engine.rule_backed.rule_policy import RulePolicy
from suites.coding.modules.workers.rules.dispatch_allowance_rule import DispatchAllowanceRule


class DispatchAllowancePolicy(RulePolicy):
    """The refusal of DispatchAllowanceRule, with today's text, as a policy of the new driver."""

    rule = DispatchAllowanceRule
    rank = "workers.policies"
