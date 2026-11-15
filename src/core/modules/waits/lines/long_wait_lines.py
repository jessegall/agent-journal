from engine.rule_backed.rule_line_source import RuleLineSource
from core.modules.waits.rules.long_wait_rule import LongWaitRule


class LongWaitLines(RuleLineSource):
    """The lines of LongWaitRule, in today's words."""

    rule = LongWaitRule
