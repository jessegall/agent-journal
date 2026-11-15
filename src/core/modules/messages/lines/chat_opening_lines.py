from engine.rule_backed.rule_line_source import RuleLineSource
from core.modules.messages.rules.chat_opening_rule import ChatOpeningRule


class ChatOpeningLines(RuleLineSource):
    """The lines of how a reply opens, in today's words of ChatOpeningRule."""

    rule = ChatOpeningRule
