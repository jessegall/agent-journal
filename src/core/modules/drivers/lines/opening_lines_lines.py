from engine.rule_backed.rule_line_source import RuleLineSource
from core.modules.drivers.rules.opening_lines_rule import OpeningLinesRule


class OpeningLinesLines(RuleLineSource):
    """The lines of OpeningLinesRule, in today's words."""

    rule = OpeningLinesRule
