from engine.rule_backed.rule_line_source import RuleLineSource
from suites.coding.rules.graphify_search_rule import GraphifySearchRule


class GraphifySearchLines(RuleLineSource):
    """The lines of GraphifySearchRule, in today's words."""

    rule = GraphifySearchRule
