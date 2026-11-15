from engine.rule_backed.rule_line_source import RuleLineSource
from core.modules.memories.rules.keyword_delivery_rule import KeywordDeliveryRule


class KeywordDeliveryLines(RuleLineSource):
    """The lines of the memories a keyword brings back, in today's words of KeywordDeliveryRule."""

    rule = KeywordDeliveryRule
