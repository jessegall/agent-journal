from engine.rule_backed.rule_effect import RuleEffect
from core.modules.memories.rules.keyword_delivery_rule import KeywordDeliveryRule


class GiveMemoriesEffect(RuleEffect):
    """The effect that gives the memories a keyword brings back, as today's KeywordDeliveryRule runs it."""

    rule = KeywordDeliveryRule
