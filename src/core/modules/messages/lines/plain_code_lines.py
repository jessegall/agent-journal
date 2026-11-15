from core.modules.drivers.support.rule_line_source import RuleLineSource
from core.modules.messages.rules.plain_code_rule import PlainCodeRule


class PlainCodeLines(RuleLineSource):
    """The lines of that code in the chat is written plainly, in today's words of PlainCodeRule."""

    rule = PlainCodeRule
