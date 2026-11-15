from engine.rule_backed.rule_effect import RuleEffect
from core.modules.processes.rules.leftover_run_rule import LeftoverRunRule


class LeftoverRunEffect(RuleEffect):
    """The effect of LeftoverRunRule, as today's rule runs it."""

    rule = LeftoverRunRule
