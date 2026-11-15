from core.modules.drivers.support.rule_effect import RuleEffect
from core.modules.messages.rules.message_read_rule import MessageReadRule


class MessageReadEffect(RuleEffect):
    """The effect that notes a message read, as today's MessageReadRule runs it."""

    rule = MessageReadRule
