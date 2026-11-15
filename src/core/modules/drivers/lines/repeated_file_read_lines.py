from engine.rule_backed.rule_line_source import RuleLineSource
from core.modules.drivers.rules.repeated_file_read_rule import RepeatedFileReadRule


class RepeatedFileReadLines(RuleLineSource):
    """The lines of RepeatedFileReadRule, in today's words."""

    rule = RepeatedFileReadRule
