from core.modules.drivers.support.rule_effect import RuleEffect
from core.modules.messages.rules.tool_message_rule import ToolMessageRule


class TextBeforeToolEffect(RuleEffect):
    """The effect that keeps the text written before a tool call, as today's ToolMessageRule runs it."""

    rule = ToolMessageRule
