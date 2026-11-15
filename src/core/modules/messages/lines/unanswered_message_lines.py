from engine.rule_backed.rule_line_source import RuleLineSource
from core.modules.messages.rules.unanswered_message_rule import UnansweredMessageRule


class UnansweredMessageLines(RuleLineSource):
    """The lines of the messages an agent read and has not answered, in today's words of UnansweredMessageRule."""

    rule = UnansweredMessageRule
