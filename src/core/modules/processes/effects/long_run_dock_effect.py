from engine.rule_backed.rule_effect import RuleEffect
from core.modules.processes.rules.long_run_dock_rule import LongRunDockRule


class LongRunDockEffect(RuleEffect):
    """The effect of LongRunDockRule, as today's rule runs it."""

    rule = LongRunDockRule
