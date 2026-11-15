from engine.rule_backed.rule_line_source import RuleLineSource
from core.modules.messages.rules.message_read_rule import MessageReadRule


class MessageReadLines(RuleLineSource):
    """The lines of what a read of a message tells the agent, in today's words of MessageReadRule."""

    rule = MessageReadRule
