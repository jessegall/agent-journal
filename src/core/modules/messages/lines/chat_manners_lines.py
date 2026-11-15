from engine.rule_backed.rule_line_source import RuleLineSource
from core.modules.messages.rules.chat_manners_rule import ChatMannersRule


class ChatMannersLines(RuleLineSource):
    """The lines of the chat's manners, in today's words of ChatMannersRule."""

    rule = ChatMannersRule
