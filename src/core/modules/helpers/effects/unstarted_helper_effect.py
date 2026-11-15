from engine.rule_backed.rule_effect import RuleEffect
from core.modules.helpers.rules.unstarted_helper_rule import UnstartedHelperRule


class UnstartedHelperEffect(RuleEffect):
    """The commands for a helper whose program never started, as today's UnstartedHelperRule runs them at the minute tick, run at the agent's
    minute step."""

    rule = UnstartedHelperRule
