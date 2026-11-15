from core.modules.drivers.support.rule_line_source import RuleLineSource
from core.modules.processes.rules.read_advice_rule import ReadAdviceRule


class ReadAdviceLines(RuleLineSource):
    """The lines of ReadAdviceRule, in today's words."""

    rule = ReadAdviceRule
