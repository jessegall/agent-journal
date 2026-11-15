from engine.rule_backed.rule_line_source import RuleLineSource
from suites.coding.rules.waiting_items_rule import WaitingItemsRule


class WaitingItemsLines(RuleLineSource):
    """The lines of WaitingItemsRule, in today's words."""

    rule = WaitingItemsRule
