from core.modules.drivers.support.rule_effect import RuleEffect
from core.modules.processes.rules.watch_lines_rule import WatchLinesRule


class WatchLinesEffect(RuleEffect):
    """The effect of WatchLinesRule, as today's rule runs it."""

    rule = WatchLinesRule
