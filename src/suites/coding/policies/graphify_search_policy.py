from engine.rule_backed.rule_policy import RulePolicy
from suites.coding.rules.graphify_search_rule import GraphifySearchRule


class GraphifySearchPolicy(RulePolicy):
    """The refusal of GraphifySearchRule, with today's text, as a policy of the new driver."""

    rule = GraphifySearchRule
    rank = "tools.policies"
