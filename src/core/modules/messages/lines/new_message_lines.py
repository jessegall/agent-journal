from engine.rule_backed.rule_line_source import RuleLineSource
from core.modules.messages.rules.message_delivery_rule import MessageDeliveryRule


class NewMessageLines(RuleLineSource):
    """The lines of the new messages an agent is told of, in today's words of MessageDeliveryRule."""

    rule = MessageDeliveryRule
