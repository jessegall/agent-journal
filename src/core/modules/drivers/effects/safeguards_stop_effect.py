from engine.rule_backed.rule_effect import RuleEffect
from core.modules.drivers.rules.safeguards_stop_rule import SafeguardsStopRule


class SafeguardsStopEffect(RuleEffect):
    """The effect of SafeguardsStopRule, as today's rule runs it."""

    rule = SafeguardsStopRule
