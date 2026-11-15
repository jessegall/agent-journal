from engine.rule_backed.rule_line_source import RuleLineSource
from core.modules.memories.rules.open_mark_rule import OpenMarkRule


class OpenMarkLines(RuleLineSource):
    """The lines of a memory mark the agent's context passed, in today's words of OpenMarkRule."""

    rule = OpenMarkRule
