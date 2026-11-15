from core.modules.drivers.support.rule_line_source import RuleLineSource
from core.modules.drivers.rules.takeover_rule import TakeoverRule


class TakeoverLines(RuleLineSource):
    """The lines of TakeoverRule, in today's words."""

    rule = TakeoverRule
