from core.modules.drivers.support.rule_effect import RuleEffect
from core.modules.memories.rules.open_mark_rule import OpenMarkRule


class OpenMarkEffect(RuleEffect):
    """The effect that opens a memory mark, as today's OpenMarkRule runs it."""

    rule = OpenMarkRule
