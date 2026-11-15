from engine.rule_backed.rule_line_source import RuleLineSource
from suites.coding.modules.workers.rules.context_stop_now_rule import ContextStopNowRule


class ContextStopNowLines(RuleLineSource):
    """The lines of ContextStopNowRule, in today's words."""

    rule = ContextStopNowRule
