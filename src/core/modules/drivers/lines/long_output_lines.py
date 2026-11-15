from engine.rule_backed.rule_line_source import RuleLineSource
from core.modules.drivers.rules.long_output_rule import LongOutputRule


class LongOutputLines(RuleLineSource):
    """The lines of LongOutputRule, in today's words."""

    rule = LongOutputRule
