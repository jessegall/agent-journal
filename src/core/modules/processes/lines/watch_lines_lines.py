from engine.rule_backed.rule_line_source import RuleLineSource
from core.modules.processes.rules.watch_lines_rule import WatchLinesRule


class WatchLinesLines(RuleLineSource):
    """The lines of WatchLinesRule, in today's words."""

    rule = WatchLinesRule
