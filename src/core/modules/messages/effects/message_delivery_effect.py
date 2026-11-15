from core.modules.drivers.support.rule_effect import RuleEffect
from core.modules.messages.rules.message_delivery_rule import MessageDeliveryRule


class MessageDeliveryEffect(RuleEffect):
    """The effect that records the delivery of the messages told, as today's MessageDeliveryRule runs it."""

    rule = MessageDeliveryRule
